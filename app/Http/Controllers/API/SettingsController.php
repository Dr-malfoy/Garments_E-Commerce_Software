<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SettingsController extends Controller
{
    public function index()
    {
        return Setting::pluck('value', 'key');
    }

    public function update(Request $request)
    {
        // Handle image upload separately
        if ($request->hasFile('app_logo')) {
            $path = $request->file('app_logo')->store('settings', 'public');
            Setting::updateOrCreate(['key' => 'app_logo'], ['value' => $path]);
        }

        // Save all other non-file fields
        $all = $request->except(['_token', '_method', 'app_logo']);
        foreach ($all as $key => $value) {
            if (!$request->hasFile($key)) {
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => (string) $value]
                );
            }
        }

        return response()->json([
            'message'  => 'Settings updated successfully',
            'settings' => Setting::pluck('value', 'key'),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6|confirmed',
        ]);

        $user->name  = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }
}
