<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Employee;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        // รับค่าค้นหาจากผู้ใช้ (search query)
        $query = $request->input('search');

        // รับค่าคอลัมน์ที่ใช้เรียงลำดับ (ค่าเริ่มต้น: emp_no)
        $sortColumn = $request->input('sortColumn', 'emp_no');

        // รับค่าลำดับการเรียง (asc หรือ desc, ค่าเริ่มต้น: desc)
        $sortOrder = $request->input('sortOrder', 'desc');

        // ตรวจสอบว่าคอลัมน์ที่เรียงคือ emp_no หรือไม่
        if ($sortColumn == 'emp_no') {
            // สลับการเรียงระหว่าง 'asc' และ 'desc' (toggle order)
            $sortOrder = $sortOrder === 'desc' ? 'asc' : 'desc';
        }

        // ดึงข้อมูลพนักงานจากฐานข้อมูล
        $employees = Employee::when($query, function ($queryBuilder, $query) {
            // กรองข้อมูลพนักงานตามชื่อหรือสกุลที่ตรงกับคำค้นหา
            $queryBuilder->where('first_name', 'like', '%' . $query . '%')
                ->orWhere('last_name', 'like', '%' . $query . '%')
                ->orWhere('gender', 'like', '%' . $query . '%');
        })
            ->orderBy($sortColumn, $sortOrder) // เรียงข้อมูลตามคอลัมน์และลำดับที่กำหนด
            ->paginate(10); // แบ่งหน้าข้อมูลเป็น 10 รายการต่อหน้า

        // ส่งข้อมูลไปยังหน้า Inertia สำหรับแสดงผล
        return Inertia::render('Employee/Index', [
            'employees' => $employees,       // รายการพนักงาน
            'query' => $query,               // คำค้นหา
            'sortColumn' => $sortColumn,     // คอลัมน์ที่ใช้เรียง
            'sortOrder' => $sortOrder,       // ลำดับการเรียง
        ]);
    }

    public function create()
    {
        // ดึงรายชื่อแผนกจากฐานข%อมูล เพื่อไปแสดงให%เลือกรายการในแบบฟอร,ม
        $departments = DB::table('departments')->select('dept_no', 'dept_name')->get();

        // สMงข%อมูลไปยังหน%า Inertia
        return inertia('Employee/Create', ['departments' => $departments]);
    }
    public function store(Request $request)
    {
        // 1. ตรวจสอบข้อมูลที่ส่งมาจากฟอร์ม
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'dept_no' => 'required|exists:departments,dept_no',
            'gender' => 'required|in:M,F',
            'photo' => 'nullable|image|mimes:jpeg,png|max:2048',
        ]);

        DB::transaction(function () use ($validated) {
            // 2. หาค่า emp_no ล่าสุด
            $latestEmpNo = DB::table('employees')->max('emp_no') ?? 0; // ถ้าไม่มีข้อมูล ให้เริ่มที่ 0
            $newEmpNo = $latestEmpNo + 1; // ค่า emp_no ล่าสุด +1

            // 3. เพิ่มข้อมูลลงในตาราง employees
            DB::table('employees')->insert([
                'emp_no' => $newEmpNo,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'birth_date' => $validated['birth_date'],
                'gender' => $validated['gender'],
                'hire_date' => now(),
            ]);

            // 4. เพิ่มข้อมูลลงในตาราง dept_emp
            DB::table('dept_emp')->insert([
                'emp_no' => $newEmpNo,
                'dept_no' => $validated['dept_no'],
                'from_date' => now(),
                'to_date' => '9999-01-01',
            ]);

            // 5. จัดการอัปโหลดรูปภาพ (ถ้ามี)
            if (isset($validated['image'])) {
                $imagePath = $validated['image']->store('employee_images', 'public');
                DB::table('employees')->where('emp_no', $newEmpNo)->update([
                    'image_path' => $imagePath,
                ]);
            }

        });

        // 6. ส่งกลับไปหน้ารายการพนักงานพร้อมกับข้อความแจ้งเตือน
        return redirect()->route('employee.index')->with('success', 'Employee created successfully.');
    }
}
