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
        Schema::create('courier_settings', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'pathao', 'steadfast'
            $table->string('title')->nullable();
            $table->decimal('charges', 10, 2)->default(0);
            $table->string('client_id')->nullable();
            $table->text('client_secret')->nullable();
            $table->string('email')->nullable();
            $table->string('password')->nullable();
            $table->string('grant_type')->default('password');
            $table->string('store_id')->nullable();
            $table->string('secret_key')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courier_settings');
    }
};
