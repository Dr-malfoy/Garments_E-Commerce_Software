<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
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
            'product_id' => 'required|exists:products,id',
            'size' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric',
            'total_price' => 'required|numeric',
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
                'delivery_charge' => 140, 
                'notes' => $validated['notes'],
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
        $order->update($request->only('status'));
        return $order;
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
