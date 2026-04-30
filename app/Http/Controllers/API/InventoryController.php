<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductSize;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index()
    {
        return Product::with(['sizes', 'category'])
            ->get()
            ->map(function ($product) {
                $product->total_stock = $product->sizes->sum('stock_qty');
                return $product;
            });
    }

    public function updateStock(Request $request, ProductSize $size)
    {
        $validated = $request->validate([
            'stock_qty' => 'required|integer|min:0',
        ]);

        $size->update($validated);

        return response()->json([
            'message' => 'Stock updated successfully',
            'size' => $size
        ]);
    }

    public function lowStock()
    {
        // Threshold for low stock can be dynamic, but let's use 10 for now
        $threshold = 10;
        
        return Product::with(['sizes' => function($query) use ($threshold) {
            $query->where('stock_qty', '<=', $threshold);
        }, 'category'])
        ->whereHas('sizes', function($query) use ($threshold) {
            $query->where('stock_qty', '<=', $threshold);
        })
        ->get();
    }
}
