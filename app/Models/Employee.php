<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'birth_date',
        'dept_no',
        'gender',
        'hire_date',
    ];

    // คุณสามารถเพิ่มความสัมพันธ์หรือฟังก์ชันอื่น ๆ ที่จำเป็นได้ที่นี่
}
