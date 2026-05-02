<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'order_id',
        'total_amount',
        'delivery_charge',
        'status',
        'cancel_requested',
        'payment_status',
        'payment_method',
        'notes',
        'pathao_city_id',
        'pathao_zone_id',
        'pathao_area_id',
        'consignment_id'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
