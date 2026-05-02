<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductSize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'sizes', 'comboOffers'])->latest();
        
        if ($request->has('limit')) {
            return $query->take($request->limit)->get();
        }
        
        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:products,code',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'sizes' => 'required|string', // Received as JSON string from FormData
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $data = $validated;
            
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $data['image'] = $path;
            }

            $product = Product::create($data);

            $sizes = json_decode($request->sizes, true);
            if (is_array($sizes)) {
                foreach ($sizes as $sizeData) {
                    $product->sizes()->create([
                        'size' => $sizeData['size'] ?? '',
                        'stock_qty' => $sizeData['stock_qty'] ?? 0,
                    ]);
                }
            }

            return $product->load('sizes');
        });
    }

    public function show(Product $product)
    {
        return $product->load(['category', 'sizes']);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:products,code,' . $product->id,
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'sizes' => 'required|string',
        ]);

        return DB::transaction(function () use ($validated, $request, $product) {
            $data = $validated;

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $data['image'] = $path;
            }

            $product->update($data);

            $product->sizes()->delete();
            $sizes = json_decode($request->sizes, true);
            if (is_array($sizes)) {
                foreach ($sizes as $sizeData) {
                    $product->sizes()->create([
                        'size' => $sizeData['size'] ?? '',
                        'stock_qty' => $sizeData['stock_qty'] ?? 0,
                    ]);
                }
            }

            return $product->load('sizes');
        });
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
