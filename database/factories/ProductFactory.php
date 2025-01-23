<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;
    /**
5
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // ตัวเลข 13 หลัก
            'product_code' => $this->faker->numerify(str_repeat('#', 13)),
            //'name' => $this->faker->words(3, true), // ชื#อสินคา้แบบสุ่ม
            'name' => fake('th_TH')->name,
            'amount' => $this->faker->randomFloat(2, 10, 1000), // ราคาสินค้า
            'votes' => $this->faker->numberBetween(0, 1000), // คะแนนโหวต
            'confirmed' => $this->faker->boolean(), // สถานะยืนยัน
            'created_at' => $this->faker->date(), // วันที่สร้าง
            'photo_path' => null, // สามารถเพิ่มรูปภาพได้
            'product_type' => $this->faker->numberBetween(1, 5),
            // ประเภทสินค้า (อ้างอิง ProductType)
        ];
    }
}
