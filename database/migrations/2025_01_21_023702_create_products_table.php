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
        Schema::create('products', function (Blueprint $table) {
            // https://laravel.com/docs/11.x/migrations#creating-tables
            // $table->charset = 'utf8mb4';
            // $table->collation = 'utf8mb4_unicode_ci';
            $table->string('product_code')->primary(); // rimary key
            $table->string('name', 100);
            $table->text('photo_path')->nullable(); // เก็บ path ของรูปภาพ
            $table->unsignedBigInteger('product_type'); // FK เชื่อมกับตาราง product_types
            $table->boolean('confirmed')->default(0); // สถานะ
            $table->double('amount', 8, 2)->nullable(); // จำนวนเงิน
            $table->integer('votes')->nullable(); // คะแนน
            $table->timestamps(); // สร้าง 2 column : created_at และ updated_at
            // เพิ่ม foreign key constraint
            $table->foreign('product_type')
            ->references('id')
            ->on('product_types')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
