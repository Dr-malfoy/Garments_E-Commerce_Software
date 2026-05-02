<?php

namespace App\Services;

use App\Models\CourierSetting;
use Enan\PathaoCourier\Facades\PathaoCourier;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;

class PathaoService
{
    public function __construct()
    {
        $this->bootConfig();
    }

    /**
     * Set configuration from database
     */
    protected function bootConfig()
    {
        $settings = CourierSetting::where('name', 'pathao')->first();
        
        if ($settings) {
            Config::set('pathao-courier.pathao_client_id', $settings->client_id);
            Config::set('pathao-courier.pathao_client_secret', $settings->client_secret);
            Config::set('pathao-courier.pathao_secret_token', $settings->secret_key);
        }
    }
    /**
     * Get all cities
     */
    public function getCities()
    {
        try {
            return PathaoCourier::GET_CITIES()->getData();
        } catch (\Exception $e) {
            Log::error("Pathao getCities Error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get zones by city ID
     */
    public function getZones($cityId)
    {
        try {
            return PathaoCourier::GET_ZONES($cityId)->getData();
        } catch (\Exception $e) {
            Log::error("Pathao getZones Error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get areas by zone ID
     */
    public function getAreas($zoneId)
    {
        try {
            return PathaoCourier::GET_AREAS($zoneId)->getData();
        } catch (\Exception $e) {
            Log::error("Pathao getAreas Error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get all stores
     */
    public function getStores()
    {
        try {
            return PathaoCourier::GET_STORES()->getData();
        } catch (\Exception $e) {
            Log::error("Pathao getStores Error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Create a new store
     */
    public function createStore(array $data)
    {
        try {
            return PathaoCourier::CREATE_STORE($data)->getData();
        } catch (\Exception $e) {
            Log::error("Pathao createStore Error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Calculate delivery charge
     */
    public function calculatePrice(array $data)
    {
        try {
            return PathaoCourier::CHECK_PRICE($data)->getData();
        } catch (\Exception $e) {
            Log::error("Pathao calculatePrice Error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Create courier order
     */
    public function createOrder(array $data)
    {
        try {
            return PathaoCourier::CREATE_ORDER($data)->getData();
        } catch (\Exception $e) {
            Log::error("Pathao createOrder Error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Track order status
     */
    public function trackOrder($consignmentId)
    {
        try {
            return PathaoCourier::TRACK_ORDER($consignmentId)->getData();
        } catch (\Exception $e) {
            Log::error("Pathao trackOrder Error: " . $e->getMessage());
            return null;
        }
    }
}
