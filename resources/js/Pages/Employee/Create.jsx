import { useForm } from '@inertiajs/react';

export default function Create({ departments }) {
    const { data, setData, post, errors } = useForm({
        birth_date: '',
        first_name: '',
        last_name: '',
        dept_no: '',
        gender: '',
        hire_date: '',
        photo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !data.first_name ||
            !data.dept_no ||
            !data.birth_date ||
            !data.gender ||
            !data.hire_date
        ) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if (data.photo && data.photo.size > 2 * 1024 * 1024) {
            alert('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 2MB');
            return;
        }

        post('/employee', {
            onSuccess: () => {
                alert('Employee added successfully!');
            },
            onError: (errors) => {
                console.error(errors);
                alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
            },
        });
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="my-6 text-center text-3xl font-bold text-black">
                Add New Employee
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-lg rounded-lg border border-gray-500 bg-white p-6 text-black shadow-lg"
            >
                {/* First Name */}
                <div className="mb-4">
                    <label
                        htmlFor="first_name"
                        className="mb-2 block font-semibold text-gray-700"
                    >
                        First Name:
                    </label>
                    <input
                        id="first_name"
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        className="w-full rounded-lg border border-gray-500 bg-gray-100 p-3 text-black focus:outline-none focus:ring-4 focus:ring-gray-500"
                    />
                    {errors.first_name && (
                        <span className="text-sm text-red-500">
                            {errors.first_name}
                        </span>
                    )}
                </div>

                {/* Last Name */}
                <div className="mb-4">
                    <label
                        htmlFor="last_name"
                        className="mb-2 block font-semibold text-gray-700"
                    >
                        Last Name:
                    </label>
                    <input
                        id="last_name"
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        className="w-full rounded-lg border border-gray-500 bg-gray-100 p-3 text-black focus:outline-none focus:ring-4 focus:ring-gray-500"
                    />
                </div>

                {/* Birth Date */}
                <div className="mb-4">
                    <label
                        htmlFor="birth_date"
                        className="mb-2 block font-semibold text-gray-700"
                    >
                        Birth Date:
                    </label>
                    <input
                        id="birth_date"
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)}
                        className="w-full rounded-lg border border-gray-500 bg-gray-100 p-3 text-black focus:outline-none focus:ring-4 focus:ring-gray-500"
                    />
                    {errors.birth_date && (
                        <span className="text-sm text-red-500">
                            {errors.birth_date}
                        </span>
                    )}
                </div>

                {/* Gender */}
                <div className="mb-4">
                    <label
                        htmlFor="gender"
                        className="mb-2 block font-semibold text-gray-700"
                    >
                        Gender:
                    </label>
                    <select
                        id="gender"
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                        className="w-full rounded-lg border border-gray-500 bg-gray-100 p-3 text-black focus:outline-none focus:ring-4 focus:ring-gray-500"
                    >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                    {errors.gender && (
                        <span className="text-sm text-red-500">
                            {errors.gender}
                        </span>
                    )}
                </div>

                {/* Hire Date */}
                <div className="mb-4">
                    <label
                        htmlFor="hire_date"
                        className="mb-2 block font-semibold text-gray-700"
                    >
                        Hire Date:
                    </label>
                    <input
                        id="hire_date"
                        type="date"
                        value={data.hire_date}
                        onChange={(e) => setData('hire_date', e.target.value)}
                        className="w-full rounded-lg border border-gray-500 bg-gray-100 p-3 text-black focus:outline-none focus:ring-4 focus:ring-gray-500"
                    />
                    {errors.hire_date && (
                        <span className="text-sm text-red-500">
                            {errors.hire_date}
                        </span>
                    )}
                </div>

                {/* Department */}
                <div className="mb-6">
                    <label
                        htmlFor="dept_no"
                        className="mb-2 block font-semibold text-gray-700"
                    >
                        Department:
                    </label>
                    <select
                        id="dept_no"
                        value={data.dept_no}
                        onChange={(e) => setData('dept_no', e.target.value)}
                        className="w-full rounded-lg border border-gray-500 bg-gray-100 p-3 text-black focus:outline-none focus:ring-4 focus:ring-gray-500"
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.dept_no} value={dept.dept_no}>
                                {dept.dept_name}
                            </option>
                        ))}
                    </select>
                    {errors.dept_no && (
                        <span className="text-sm text-red-500">
                            {errors.dept_no}
                        </span>
                    )}
                </div>

                {/* Photo */}
                <div className="mb-4">
                    <label
                        htmlFor="photo"
                        className="mb-2 block font-semibold text-gray-700"
                    >
                        Photo:
                    </label>
                    <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && file.size > 2 * 1024 * 1024) {
                                alert('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 2MB');
                                return;
                            }
                            setData('photo', file);
                        }}
                        className="w-full rounded-lg border border-gray-500 bg-gray-100 p-3 text-black focus:outline-none focus:ring-4 focus:ring-gray-500"
                    />
                    {errors.photo && (
                        <span className="text-sm text-red-500">
                            {errors.photo}
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full rounded-lg bg-gray-800 py-3 text-white transition hover:bg-gray-900"
                >
                    Add Employee
                </button>
            </form>
        </div>
    );
}
