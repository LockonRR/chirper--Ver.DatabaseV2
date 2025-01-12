<?php
use App\Http\Controllers\EmployeeController;
use Illuminate\Http\Request;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
// นำเข้าคอนโทรลเลอร์ที่ใช้ในเส้นทางต่าง ๆ
use App\Http\Controllers\ChirpController;
use App\Http\Controllers\ProfileController;
// นำเข้าคลาสที่ใช้สำหรับแอปพลิเคชัน
use Illuminate\Foundation\Application;
// นำเข้าคลาสที่ใช้สำหรับกำหนดเส้นทาง
use Illuminate\Support\Facades\Route;
// นำเข้า Inertia สำหรับการเรนเดอร์หน้าเว็บ
use Inertia\Inertia;

Route::get('/employee', [EmployeeController::class, 'index'])->middleware(['auth', 'verified'])->name('employee');;

//7-1-25
// หน%าแบบฟอร,มสำหรับเพิ่มข้อมูลพนักงาน
Route::get('/employee/create', [EmployeeController::class, 'create'])
->name('employees.create');

// Function สำหรับบันทึกข้อมูลพนักงาน
Route::post('/employee', [EmployeeController::class, 'store'])
->name('employees.store');



// เส้นทางหลักของเว็บไซต์ที่แสดงหน้าต้อนรับ
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'), // ตรวจสอบว่ามีเส้นทางเข้าสู่ระบบ
        'canRegister' => Route::has('register'), // ตรวจสอบว่ามีเส้นทางสมัครสมาชิก
        'laravelVersion' => Application::VERSION, // แสดงเวอร์ชันของ Laravel
        'phpVersion' => PHP_VERSION, // แสดงเวอร์ชันของ PHP
    ]);
});


// เส้นทางสำหรับแดชบอร์ดที่ต้องการการยืนยันตัวตนและอีเมล
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// กลุ่มเส้นทางที่ต้องการการยืนยันตัวตน
Route::middleware('auth')->group(function () {
    // เส้นทางสำหรับการแก้ไขข้อมูลโปรไฟล์
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // เส้นทางสำหรับการอัพเดทข้อมูลโปรไฟล์
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // เส้นทางสำหรับการลบโปรไฟล์
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// รวมเส้นทางที่เกี่ยวข้องกับการเข้าสู่ระบบและการยืนยันอีเมล
require __DIR__.'/auth.php';
