<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// กลุ่มเส้นทาง Employee
Route::get('/employee', [EmployeeController::class, 'index'])
->name('employee.index');

Route::get('/employee/create', [EmployeeController::class, 'create'])
    ->name('employee.create');

Route::post('/employee', [EmployeeController::class, 'store'])
->name('employee.store');

// เส้นทางหลักของเว็บไซต์
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// เส้นทางแดชบอร์ด
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// เส้นทางโปรไฟล์
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// เส้นทางสินค้า
Route::get('/products', [ProductController::class, 'index']);

// รวมเส้นทางที่เกี่ยวข้องกับการเข้าสู่ระบบและการยืนยันอีเมล
require __DIR__ . '/auth.php';
