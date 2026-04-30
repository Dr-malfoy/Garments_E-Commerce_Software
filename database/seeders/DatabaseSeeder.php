<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SettingsSeeder::class,
        ]);

        // Admin User
        \App\Models\User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@garments.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin',
        ]);

        // Sample Categories
        $categories = [
            ['name' => 'T-Shirts', 'slug' => 't-shirts'],
            ['name' => 'Polo Shirts', 'slug' => 'polo-shirts'],
            ['name' => 'Shirts', 'slug' => 'shirts'],
            ['name' => 'Pants', 'slug' => 'pants'],
        ];

        foreach ($categories as $cat) {
            \App\Models\Category::create($cat);
        }

        // Sample Settings
        \App\Models\Setting::create(['key' => 'otp_verification', 'value' => 'false']);
        \App\Models\Setting::create(['key' => 'delivery_charge_1', 'value' => '140']);
        \App\Models\Setting::create(['key' => 'delivery_charge_2_plus', 'value' => '120']);

        // Sample Delivery Charges
        \App\Models\DeliveryCharge::create(['item_count' => 1, 'charge_amount' => 140]);
        \App\Models\DeliveryCharge::create(['item_count' => 2, 'charge_amount' => 120]);
    }
}
