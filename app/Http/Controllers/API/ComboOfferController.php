<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ComboOffer;
use Illuminate\Http\Request;

class ComboOfferController extends Controller
{
    public function index()
    {
        return ComboOffer::with('products')->latest()->get();
    }

    public function publicIndex()
    {
        return ComboOffer::where('is_active', true)->with('products')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'quantity' => 'required|integer|min:2',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'product_ids' => 'required|array',
        ]);

        $offer = ComboOffer::create($validated);
        $offer->products()->sync($request->product_ids);

        return response()->json($offer->load('products'), 201);
    }

    public function show(ComboOffer $comboOffer)
    {
        return $comboOffer->load('products');
    }

    public function update(Request $request, ComboOffer $comboOffer)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'quantity' => 'required|integer|min:2',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'product_ids' => 'required|array',
        ]);

        $comboOffer->update($validated);
        $comboOffer->products()->sync($request->product_ids);

        return response()->json($comboOffer->load('products'));
    }

    public function destroy(ComboOffer $comboOffer)
    {
        $comboOffer->delete();
        return response()->json(null, 204);
    }
}
