<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComboOffer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'quantity', 'price', 'is_active'];

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}
