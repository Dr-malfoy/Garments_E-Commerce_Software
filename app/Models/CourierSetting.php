<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourierSetting extends Model
{
    use HasFactory;

    protected $table = 'pathao_courier';
    protected $guarded = [];
}
