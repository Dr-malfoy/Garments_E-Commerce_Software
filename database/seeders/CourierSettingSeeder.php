<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourierSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $couriers = [
            ['name' => 'pathao', 'title' => 'Pathao Courier'],
            ['name' => 'steadfast', 'title' => 'Steadfast Courier'],
            ['name' => 'courier', 'title' => 'Generic Courier'],
        ];

        foreach ($couriers as $courier) {
            \App\Models\CourierSetting::firstOrCreate(
                ['name' => $courier['name']],
                ['title' => $courier['title'], 'is_active' => false]
            );
        }
    }
}
