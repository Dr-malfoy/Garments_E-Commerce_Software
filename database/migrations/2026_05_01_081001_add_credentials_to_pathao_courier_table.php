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
            $table->string('name')->default('pathao')->after('id');
            $table->string('title')->nullable()->after('name');
            $table->decimal('charges', 10, 2)->default(0)->after('title');
            $table->string('client_id')->nullable()->after('charges');
            $table->text('client_secret')->nullable()->after('client_id');
            $table->string('email')->nullable()->after('client_secret');
            $table->string('password')->nullable()->after('email');
            $table->string('grant_type')->default('password')->after('password');
            $table->string('store_id')->nullable()->after('grant_type');
            $table->string('secret_key')->nullable()->after('store_id');
            $table->boolean('is_active')->default(false)->after('secret_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pathao_courier', function (Blueprint $table) {
            $table->dropColumn(['name', 'title', 'charges', 'client_id', 'client_secret', 'email', 'password', 'grant_type', 'store_id', 'secret_key', 'is_active']);
        });
    }
};
