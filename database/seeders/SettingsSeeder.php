<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'app_name' => 'Garments Pro',
            'hero_title' => 'Quality Garments Redefined.',
            'hero_desc' => 'Discover our curated collection of premium cotton tees, polos, and casual wear. Designed for comfort, built for style.',
            'contact_email' => 'support@garmentspro.com',
            'pathao_api_key' => '',
            'steadfast_api_key' => '',
        ];

        foreach ($defaults as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
