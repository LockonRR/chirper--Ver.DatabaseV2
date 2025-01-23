<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'product_type',
        'amount',
        'photo',
        'confirmed',
        'votes',
        'created_date',
    ]; // กำหนดฟgลดaที่สามารถเพิ่มขRอมูลไดRผ_าน mass assignment
    public function productType() // ความสัมพันธa Many-to-One กับ ProductType
    {
        return $this->belongsTo(ProductType::class, 'product_type');
    }
}
