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
        Schema::table('pathao_courier', function (Blueprint $table) {
            $table->uuid('secret_token')->nullable()->change();
            $table->text('token')->nullable()->change();
            $table->text('refresh_token')->nullable()->change();
            $table->string('expires_in')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pathao_courier', function (Blueprint $table) {
            $table->uuid('secret_token')->nullable(false)->change();
            $table->text('token')->nullable(false)->change();
            $table->text('refresh_token')->nullable(false)->change();
            $table->string('expires_in')->nullable(false)->change();
        });
    }
};
