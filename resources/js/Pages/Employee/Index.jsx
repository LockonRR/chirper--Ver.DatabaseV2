// นำเข้าโมดูลและ Hook ที่จำเป็น
import { router } from '@inertiajs/react'; // ใช้สำหรับการจัดการเส้นทางและสถานะใน Inertia.js
import { useState } from 'react'; // React Hook สำหรับจัดการสถานะของคอมโพเนนต์

// คอมโพเนนต์หลักสำหรับแสดงและจัดการข้อมูลพนักงาน
export default function Index({ employees, query }) {
    // กำหนดตัวแปรสถานะ (State)
    const [search, setSearch] = useState(query || ''); // สถานะสำหรับเก็บข้อความค้นหา
    const [sortColumn, setSortColumn] = useState('emp_no'); // สถานะสำหรับเก็บคอลัมน์ที่ใช้จัดเรียง
    const [sortOrder, setSortOrder] = useState('asc'); // สถานะสำหรับเก็บลำดับการจัดเรียง (asc/desc)
    const [currentPage, setCurrentPage] = useState(employees.current_page); // หน้าปัจจุบัน
    const [totalPages, setTotalPages] = useState(employees.last_page); // จำนวนหน้าทั้งหมด
    const [isLoading, setIsLoading] = useState(false); // สถานะสำหรับการโหลดข้อมูล

    // ฟังก์ชันสำหรับดึงข้อมูลพนักงานจากเซิร์ฟเวอร์
    const fetchEmployees = (params) => {
        setIsLoading(true); // ตั้งค่าสถานะการโหลดเป็น true
        router.get('/employee', params, {
            replace: true, // แทนที่สถานะในประวัติการนำทาง
            preserveState: true, // รักษาสถานะของคอมโพเนนต์
            onFinish: () => setIsLoading(false), // ตั้งค่าสถานะการโหลดเป็น false หลังจากดึงข้อมูลเสร็จ
        });
    };

    // ฟังก์ชันจัดการการค้นหา
    const handleSearch = (e) => {
        e.preventDefault(); // ป้องกันการโหลดหน้าใหม่
        fetchEmployees({ search, sortColumn, sortOrder, page: 1 }); // ดึงข้อมูลด้วยข้อความค้นหาใหม่
    };

    // ฟังก์ชันจัดการการเปลี่ยนหน้า
    const handlePageChange = (page) => {
        setCurrentPage(page); // อัปเดตหน้าปัจจุบัน
        fetchEmployees({ search, sortColumn, sortOrder, page }); // ดึงข้อมูลของหน้าที่เลือก
    };

    // ฟังก์ชันจัดการการจัดเรียง
    const handleSort = (column) => {
        // เปลี่ยนลำดับการจัดเรียงหากคลิกที่คอลัมน์เดิม
        const newSortOrder =
            column === sortColumn && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column); // อัปเดตคอลัมน์ที่ใช้จัดเรียง
        setSortOrder(newSortOrder); // อัปเดตลำดับการจัดเรียง
        fetchEmployees({
            search,
            sortColumn: column,
            sortOrder: newSortOrder,
            page: currentPage, // ใช้หน้าปัจจุบัน
        });
    };

    // แสดงผลคอมโพเนนต์
    return (
        <div className="container mx-auto px-4">
            {/* หัวข้อของหน้า */}
            <h1 className="my-6 text-center text-3xl font-bold text-gray-800">
                ConceptRR Employees
            </h1>

            {/* ฟอร์มค้นหา */}
            <form onSubmit={handleSearch} className="mb-6 flex justify-center">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} // อัปเดตสถานะข้อความค้นหา
                    className="bgd-white w-1/3 rounded-l-md border border-gray-300 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Search employees..." // ข้อความตัวอย่างในช่องค้นหา
                />
                <button
                    type="submit"
                    className="rounded-r-md bg-gray-800 px-5 py-3 text-white transition hover:bg-gray-600"
                >
                    Search
                </button>
            </form>

            {/* แสดงสถานะการโหลดหรือข้อมูลพนักงาน */}
            {isLoading ? (
                <p className="text-center font-semibold text-gray-600">
                    Loading...
                </p>
            ) : employees.data.length > 0 ? (
                <>
                    {/* ตารางข้อมูลพนักงาน */}
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 bg-white text-gray-800">
                            <thead>
                                <tr className="bg-gray-200">
                                    {[
                                        'emp_no',
                                        'first_name',
                                        'last_name',
                                        'gender',
                                        'birth_date',
                                    ].map((col) => (
                                        <th
                                            key={col}
                                            onClick={() => handleSort(col)} // จัดเรียงข้อมูลเมื่อคลิกที่หัวคอลัมน์
                                            className="cursor-pointer px-4 py-3 text-left transition hover:bg-gray-300"
                                        >
                                            {col
                                                .replace('_', ' ')
                                                .toUpperCase()}{' '}
                                            {/* แปลงชื่อคอลัมน์ให้เป็นตัวพิมพ์ใหญ่ */}
                                            {sortColumn === col && (
                                                <span>
                                                    {sortOrder === 'asc'
                                                        ? ' ↑'
                                                        : ' ↓'}{' '}
                                                    {/* แสดงลำดับการจัดเรียง */}
                                                </span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {employees.data.map((employee, index) => (
                                    <tr
                                        key={employee.emp_no}
                                        className={`${
                                            index % 2 === 0
                                                ? 'bg-white'
                                                : 'bg-gray-100'
                                        } hover:bg-gray-300`}
                                    >
                                        {/* ข้อมูลพนักงาน */}
                                        <td className="px-4 py-3">
                                            {employee.emp_no}
                                        </td>
                                        <td className="px-4 py-3">
                                            {employee.first_name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {employee.last_name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {employee.gender === 'M'
                                                ? 'Male'
                                                : 'Female'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {employee.birth_date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* การควบคุมการเปลี่ยนหน้า */}
                    <div className="mt-6 flex items-center justify-center space-x-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)} // เปลี่ยนไปหน้าก่อนหน้า
                            disabled={currentPage === 1} // ปิดการใช้งานถ้าอยู่หน้าที่ 1
                            className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            Previous
                        </button>

                        <span className="font-semibold text-gray-800">
                            {currentPage} / {totalPages}{' '}
                            {/* แสดงหน้าปัจจุบันและจำนวนหน้าทั้งหมด */}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)} // เปลี่ยนไปหน้าถัดไป
                            disabled={currentPage === totalPages} // ปิดการใช้งานถ้าอยู่หน้าสุดท้าย
                            className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-center font-semibold text-gray-600">
                    No data found
                </p>
            )}
        </div>
    );
}
