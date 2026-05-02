<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index()
    {
        return Cache::rememberForever('app_categories', function () {
            return Category::all();
        });
    }

    public function store(Request $request)
    {
        $request->merge([
            'slug' => Str::slug($request->name)
        ]);

        $validated = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string|unique:categories,slug',
        ]);

        $category = Category::create($validated);
        Cache::forget('app_categories');
        return $category;
    }

    public function show(Category $category)
    {
        return $category;
    }

    public function update(Request $request, Category $category)
    {
        $request->merge([
            'slug' => Str::slug($request->name)
        ]);

        $validated = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string|unique:categories,slug,' . $category->id,
        ]);

        $category->update($validated);
        Cache::forget('app_categories');
        return $category;
    }

    public function destroy(Category $category)
    {
        $category->delete();
        Cache::forget('app_categories');
        return response()->json(['message' => 'Deleted']);
    }
}
