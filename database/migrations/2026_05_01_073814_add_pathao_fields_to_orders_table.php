<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->integer('pathao_city_id')->nullable();
            $table->integer('pathao_zone_id')->nullable();
            $table->integer('pathao_area_id')->nullable();
            $table->string('consignment_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['pathao_city_id', 'pathao_zone_id', 'pathao_area_id', 'consignment_id']);
        });
    }
};
