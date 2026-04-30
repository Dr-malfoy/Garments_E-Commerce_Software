<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'address',
        'district',
        'thana',
        'area',
        'is_starred',
        'is_advance_required'
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
