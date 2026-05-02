<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\PathaoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PathaoController extends Controller
{
    protected $pathaoService;

    public function __construct(PathaoService $pathaoService)
    {
        $this->pathaoService = $pathaoService;
    }

    /**
     * Get Cities
     */
    public function getCities()
    {
        $cities = $this->pathaoService->getCities();
        return response()->json($cities);
    }

    /**
     * Get Zones
     */
    public function getZones($cityId)
    {
        $zones = $this->pathaoService->getZones($cityId);
        return response()->json($zones);
    }

    /**
     * Get Areas
     */
    public function getAreas($zoneId)
    {
        $areas = $this->pathaoService->getAreas($zoneId);
        return response()->json($areas);
    }

    /**
     * Get Stores
     */
    public function getStores()
    {
        $stores = $this->pathaoService->getStores();
        return response()->json($stores);
    }

    /**
     * Create Store
     */
    public function createStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'contact_name' => 'required|string',
            'contact_number' => 'required|string',
            'address' => 'required|string',
            'city_id' => 'required|integer',
            'zone_id' => 'required|integer',
            'area_id' => 'required|integer',
        ]);

        try {
            $store = $this->pathaoService->createStore($request->all());
            return response()->json($store);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create store', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Check Price
     */
    public function checkPrice(Request $request)
    {
        $request->validate([
            'store_id' => 'required|integer',
            'recipient_city_id' => 'required|integer',
            'recipient_zone_id' => 'required|integer',
            'item_type' => 'required|integer', // 1 for Document, 2 for Parcel
            'item_weight' => 'required|numeric',
            'delivery_type' => 'required|integer', // 48 for Normal, 12 for On Demand
        ]);

        try {
            $price = $this->pathaoService->calculatePrice($request->all());
            return response()->json($price);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to calculate price', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Create Order
     */
    public function createOrder(Request $request)
    {
        $request->validate([
            'store_id' => 'required|integer',
            'recipient_name' => 'required|string',
            'recipient_phone' => 'required|string',
            'recipient_address' => 'required|string',
            'recipient_city_id' => 'required|integer',
            'recipient_zone_id' => 'required|integer',
            'recipient_area_id' => 'required|integer',
            'delivery_type' => 'required|integer',
            'item_type' => 'required|integer',
            'special_instruction' => 'nullable|string',
            'item_quantity' => 'required|integer',
            'item_weight' => 'required|numeric',
            'amount_to_collect' => 'required|numeric',
            'item_description' => 'nullable|string',
        ]);

        try {
            $order = $this->pathaoService->createOrder($request->all());
            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create order', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Track Order
     */
    public function trackOrder($consignmentId)
    {
        $tracking = $this->pathaoService->trackOrder($consignmentId);
        return response()->json($tracking);
    }

    /**
     * Webhook for Pathao Status Updates
     */
    public function webhook(Request $request)
    {
        $secret = config('pathao-courier.pathao_secret_token');
        $providedSecret = $request->header('X-PATHAO-SECRET');

        if ($secret !== $providedSecret) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Handle the status update logic here
        $data = $request->all();
        Log::info('Pathao Webhook Data: ', $data);

        // Example: Update order status in your database
        // Order::where('consignment_id', $data['consignment_id'])->update(['status' => $data['order_status']]);

        return response()->json(['message' => 'Webhook received']);
    }
}
