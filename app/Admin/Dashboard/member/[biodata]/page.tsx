"use client"

import { EmployeeProps, getEmployee, updateEmployee } from '@/app/firebase/firebasehelper';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const BiodataPage = () => {
    const [employee, setEmployee] = useState<EmployeeProps | null>(null);
    const [id, setId] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    
    useEffect(() => {
            // Get ID from URL
            if (typeof window !== 'undefined') {
                const pathname = window.location.pathname;
                const pathParts = pathname.split('/');
                const employeeId = pathParts[pathParts.length - 1];
                setId(employeeId);
            }
        }, [searchParams]);
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                if (id) {
                    const employeeData = await getEmployee(id);
                    setEmployee(employeeData);
                }
            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        };
        
        fetchEmployee();
    }, [id]);
   
    if (!employee) {
        return <div>Loading...</div>;
    }

    const handleUpdate = async () => {
        try {
            // Panggil fungsi untuk mengupdate data karyawan di Firebase
            // Gunakan employee sebagai data yang akan diperbarui
            await updateEmployee(employee);
            await toast.success("Update Employee Success!")
            router.push('/Admin/Dashboard')
            console.log('Employee updated successfully!');
        } catch (error) {
            toast.error("Failed to update!")
            console.error('Error updating employee:', error);
        }
    };

    return (
        <section className="p-8 grid h-full gap-8">
            {/* Top */}
            <div className="flex flex-col sm:flex-row sm:justify-between p-4 sm:items-center">
                {/* left */}
                <div className="pb-4 sm:pb-0">
                    <h1 className="text-3xl">Edit Biodata</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-8">
                {/* Photo */}
                <div className="flex flex-col items-center gap-4">
                    <div className=" bg-gray-200 rounded-full flex items-center justify-center">
                        <img className=" w-40 h-40  rounded-full" src={employee.fotoURL}></img>
                    </div>
                </div>

                {/* Input Fields */}
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={employee.name} 
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your name"
                            onChange={(e) => setEmployee({...employee, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">ID #</label>
                        <input
                            type="text"
                            value={employee.id} 
                            className="w-full px-4 py-2 border rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Jabatan</label>
                        <input
                            type="text"
                            value={employee.jabatan}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your jabatan"
                            onChange={(e) => setEmployee({...employee, jabatan: e.target.value})}
                        />
                    </div>
                </div>

                {/* Update Button */}
                <div className="flex justify-center">
                    <button onClick={handleUpdate} className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        Update
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BiodataPage;
