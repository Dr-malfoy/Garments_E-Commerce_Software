<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        return Customer::withCount('orders')
            ->withSum('orders', 'total_amount')
            ->orderBy('is_starred', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function show(Customer $customer)
    {
        return $customer->load(['orders.items.product']);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string|unique:customers,phone,' . $customer->id,
            'district' => 'required|string',
            'thana' => 'required|string',
            'area' => 'required|string',
            'is_starred' => 'boolean',
        ]);

        $customer->update($validated);

        return response()->json(['message' => 'Customer updated successfully', 'customer' => $customer]);
    }

    public function toggleStar(Customer $customer)
    {
        $customer->is_starred = !$customer->is_starred;
        $customer->save();

        return response()->json(['message' => 'Customer star status updated', 'is_starred' => $customer->is_starred]);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(['message' => 'Customer deleted successfully']);
    }
}
