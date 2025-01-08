import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ employees, query }) {
    const [search, setSearch] = useState(query || '');
    const [sortColumn, setSortColumn] = useState('emp_no');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(employees.current_page);
    const [totalPages, setTotalPages] = useState(employees.last_page);
    const [isLoading, setIsLoading] = useState(false);

    const fetchEmployees = (params) => {
        setIsLoading(true);
        router.get('/employee', params, {
            replace: true,
            preserveState: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchEmployees({ search, sortColumn, sortOrder, page: 1 });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchEmployees({ search, sortColumn, sortOrder, page });
    };

    const handleSort = (column) => {
        const newSortOrder =
            column === sortColumn && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(newSortOrder);
        fetchEmployees({
            search,
            sortColumn: column,
            sortOrder: newSortOrder,
            page: currentPage,
        });
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="my-6 text-center text-3xl font-bold text-gray-800">
                ConceptRR Employees
            </h1>

            <form onSubmit={handleSearch} className="mb-6 flex justify-center">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bgd-white w-1/3 rounded-l-md border border-gray-300 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Search employees..."
                />
                <button
                    type="submit"
                    className="rounded-r-md bg-gray-800 px-5 py-3 text-white transition hover:bg-gray-600"
                >
                    Search
                </button>
            </form>

            {isLoading ? (
                <p className="text-center font-semibold text-gray-600">
                    Loading...
                </p>
            ) : employees.data.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 bg-white text-gray-800">
                            <thead>
                                <tr className="bg-gray-200">
                                    {[
                                        'emp_no',
                                        'first_name',
                                        'last_name',
                                        'gender',
                                        'birthday',
                                    ].map((col) => (
                                        <th
                                            key={col}
                                            onClick={() => handleSort(col)}
                                            className="cursor-pointer px-4 py-3 text-left transition hover:bg-gray-300"
                                        >
                                            {col
                                                .replace('_', ' ')
                                                .toUpperCase()}
                                            {sortColumn === col && (
                                                <span>
                                                    {sortOrder === 'asc'
                                                        ? ' ↑'
                                                        : ' ↓'}
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

                    <div className="mt-6 flex items-center justify-center space-x-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            Previous
                        </button>

                        <span className="font-semibold text-gray-800">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
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
