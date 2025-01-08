<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Employee;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('search');
        $sortColumn = $request->input('sortColumn', 'emp_no'); // Default sort column
        $sortOrder = $request->input('sortOrder', 'desc'); // Default sort order is 'desc'

        // Handle the sorting for 'emp_no'
        if ($sortColumn == 'emp_no') {
            $sortOrder = $sortOrder === 'desc' ? 'asc' : 'desc'; // Toggle the order between 'asc' and 'desc'
        }

        $employees = Employee::when($query, function ($queryBuilder, $query) {
            $queryBuilder->where('first_name', 'like', '%' . $query . '%')
                ->orWhere('last_name', 'like', '%' . $query . '%');
        })
        ->orderBy($sortColumn, $sortOrder) // Apply sorting
        ->paginate(10);

        return Inertia::render('Employee/Index', [
            'employees' => $employees,
            'query' => $query,
            'sortColumn' => $sortColumn,
            'sortOrder' => $sortOrder,
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
        $validated = $request->validate([
            'emp_no' => 'required|unique:employees|max:10',
            'first_name' => 'required|max:50',
        ], [
            'emp_no.required' => 'Employee number is required.',
            'emp_no.unique' => 'Employee number must be unique.',
            'first_name.required' => 'First name is required.',
        ]);

        Employee::create($validated);

        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }

    public function show(Employee $employee)
    {
        return Inertia::render('Employees/Show', [
            'employee' => $employee,
        ]);
    }

    public function edit(Employee $employee)
    {
        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'emp_no' => 'required|max:10',
            'first_name' => 'required|max:50',
        ]);

        $employee->update($validated);

        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->route('employees.index')->with('success', 'Employee deleted successfully.');
    }
}
