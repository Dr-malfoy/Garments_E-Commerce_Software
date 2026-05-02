<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Customer;
use App\Models\Product;
use App\Services\PathaoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    protected $pathaoService;

    public function __construct(PathaoService $pathaoService)
    {
        $this->pathaoService = $pathaoService;
    }

    public function index()
    {
        return Order::with('customer')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'district' => 'required|string',
            'thana' => 'required|string',
            'area' => 'nullable|string',
            'pathao_city_id' => 'nullable|integer',
            'pathao_zone_id' => 'nullable|integer',
            'pathao_area_id' => 'nullable|integer',
            'product_id' => 'required|exists:products,id',
            'size' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric',
            'total_price' => 'required|numeric',
            'delivery_charge' => 'nullable|numeric',
            'combo_offer_name' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $customer = Customer::updateOrCreate(
                ['phone' => $validated['phone']],
                [
                    'name' => $validated['name'],
                    'district' => $validated['district'],
                    'thana' => $validated['thana'],
                    'area' => $validated['area'],
                ]
            );

            $orderId = 'GRM-' . strtoupper(Str::random(6));

            $order = Order::create([
                'order_id' => $orderId,
                'customer_id' => $customer->id,
                'status' => 'pending',
                'total_amount' => $validated['total_price'],
                'delivery_charge' => $validated['delivery_charge'] ?? 140, 
                'notes' => $validated['notes'],
                'pathao_city_id' => $validated['pathao_city_id'],
                'pathao_zone_id' => $validated['pathao_zone_id'],
                'pathao_area_id' => $validated['pathao_area_id'],
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $validated['product_id'],
                'size' => $validated['size'],
                'qty' => $validated['quantity'],
                'unit_price' => $validated['unit_price'],
                'combo_offer_name' => $validated['combo_offer_name'] ?? null,
            ]);

            return $order;
        });
    }

    public function show(Order $order)
    {
        return $order->load(['customer', 'items.product']);
    }

    public function update(Request $request, Order $order)
    {
        $oldStatus = $order->status;
        $order->update($request->only('status'));

        // Auto create Pathao order if confirmed
        if ($oldStatus !== 'confirmed' && $order->status === 'confirmed' && $order->pathao_area_id) {
            $this->createPathaoOrder($order);
        }

        return $order;
    }

    protected function createPathaoOrder(Order $order)
    {
        try {
            $customer = $order->customer;
            $item = $order->items()->first();
            $product = $item->product;

            $pathaoOrderData = [
                'store_id' => 1, // You should make this configurable
                'recipient_name' => $customer->name,
                'recipient_phone' => $customer->phone,
                'recipient_address' => $customer->area . ', ' . $customer->thana . ', ' . $customer->district,
                'recipient_city_id' => $order->pathao_city_id,
                'recipient_zone_id' => $order->pathao_zone_id,
                'recipient_area_id' => $order->pathao_area_id,
                'delivery_type' => 48, // Normal
                'item_type' => 2, // Parcel
                'item_quantity' => $item->qty,
                'item_weight' => 0.5,
                'amount_to_collect' => $order->total_amount + $order->delivery_charge,
                'item_description' => $product->name . ' (Size: ' . $item->size . ')',
            ];

            $response = $this->pathaoService->createOrder($pathaoOrderData);
            
            if (isset($response['data']['consignment_id'])) {
                $order->update([
                    'consignment_id' => $response['data']['consignment_id']
                ]);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to auto-create Pathao order: " . $e->getMessage());
        }
    }

    public function trackByPhone($phone)
    {
        $customer = Customer::where('phone', $phone)->first();
        if (!$customer) {
            return response()->json([], 200);
        }

        return Order::where('customer_id', $customer->id)
            ->with(['items.product'])
            ->latest()
            ->get();
    }

    public function requestCancel(Order $order)
    {
        if (in_array(strtolower($order->status), ['pending', 'confirmed'])) {
            $order->update(['cancel_requested' => true]);
            return response()->json(['message' => 'Cancellation requested successfully']);
        }
        return response()->json(['message' => 'Order cannot be cancelled at this stage'], 422);
    }

    public function approveCancel(Order $order)
    {
        $order->update([
            'status' => 'cancelled',
            'cancel_requested' => false
        ]);
        return response()->json(['message' => 'Order cancelled successfully']);
    }

    public function rejectCancel(Order $order)
    {
        $order->update(['cancel_requested' => false]);
        return response()->json(['message' => 'Cancellation request rejected']);
    }
}
