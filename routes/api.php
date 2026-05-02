<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\SettingsController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\CustomerController;
use App\Http\Controllers\API\InventoryController;
use App\Http\Controllers\API\FeedbackController;
use App\Http\Controllers\API\BannerController;
use App\Http\Controllers\API\ComboOfferController;
use App\Http\Controllers\API\PathaoController;
use App\Http\Controllers\API\LogisticSettingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('orders', OrderController::class);
    Route::post('/orders/{order}/approve-cancel', [OrderController::class, 'approveCancel']);
    Route::post('/orders/{order}/reject-cancel', [OrderController::class, 'rejectCancel']);
    Route::apiResource('combo-offers', ComboOfferController::class);
    
    // Settings & User Management
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::post('/settings', [SettingsController::class, 'update']);
    Route::post('/settings/profile', [SettingsController::class, 'updateProfile']);
    Route::apiResource('users', UserController::class);

    // Customer Management
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/{customer}', [CustomerController::class, 'show']);
    Route::put('/customers/{customer}', [CustomerController::class, 'update']);
    Route::patch('/customers/{customer}/toggle-star', [CustomerController::class, 'toggleStar']);
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);

    // Inventory Management
    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::get('/inventory/low-stock', [InventoryController::class, 'lowStock']);
    Route::patch('/inventory/size/{size}', [InventoryController::class, 'updateStock']);

    // Reports (Feedback)
    Route::get('/reports', [FeedbackController::class, 'index']);
    Route::delete('/reports/{feedback}', [FeedbackController::class, 'destroy']);

    // Banner Management
    Route::apiResource('banners', BannerController::class);

    // Pathao Courier Routes
    Route::prefix('pathao')->group(function () {
        Route::get('/cities', [PathaoController::class, 'getCities']);
        Route::get('/zones/{cityId}', [PathaoController::class, 'getZones']);
        Route::get('/areas/{zoneId}', [PathaoController::class, 'getAreas']);
        Route::get('/stores', [PathaoController::class, 'getStores']);
        Route::post('/stores', [PathaoController::class, 'createStore']);
        Route::post('/check-price', [PathaoController::class, 'checkPrice']);
        Route::post('/orders', [PathaoController::class, 'createOrder']);
        Route::get('/track/{consignmentId}', [PathaoController::class, 'trackOrder']);
    });

    // Logistic Settings Routes
    Route::post('/logistic-settings/generate-secret', [LogisticSettingController::class, 'generateSecret']);
    Route::get('/logistic-settings', [LogisticSettingController::class, 'index']);
    Route::get('/logistic-settings/{name}', [LogisticSettingController::class, 'show']);
    Route::post('/logistic-settings/{name}', [LogisticSettingController::class, 'update']);
});

// Pathao Webhook (Public)
Route::post('/pathao/webhook', [PathaoController::class, 'webhook']);

// Public routes for customer website
Route::get('/public/categories', [CategoryController::class, 'index']);
Route::get('/public/products', [ProductController::class, 'index']);
Route::get('/public/banners', [BannerController::class, 'index']);
Route::get('/public/settings', [SettingsController::class, 'index']);
Route::get('/public/combo-offers', [ComboOfferController::class, 'publicIndex']);
Route::get('/public/track-order/{phone}', [OrderController::class, 'trackByPhone']);
Route::post('/public/orders/{order}/cancel-request', [OrderController::class, 'requestCancel']);
Route::post('/public/orders', [OrderController::class, 'store']);
Route::post('/public/feedback', [FeedbackController::class, 'store']);

// Public Pathao routes
Route::get('/public/pathao/cities', [PathaoController::class, 'getCities']);
Route::get('/public/pathao/zones/{cityId}', [PathaoController::class, 'getZones']);
Route::get('/public/pathao/areas/{zoneId}', [PathaoController::class, 'getAreas']);
Route::post('/public/pathao/check-price', [PathaoController::class, 'checkPrice']);

