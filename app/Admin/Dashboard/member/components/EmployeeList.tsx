import Link from "next/link";
import { FiEdit2 } from "react-icons/fi";
import { deleteEmployee, EmployeeProps } from "@/app/firebase/firebasehelper";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EmployeeList: React.FC<{ employees: EmployeeProps[]}>  = ({ employees }) => {
    const [ selectedEmployees, setSelectedEmployees ] = useState<string[]>([]);
    const [ isAllSelected, setIsAllSelected ] = useState<boolean>(false);

    useEffect(() => {
        setIsAllSelected(selectedEmployees.length === employees.length);
    }, [selectedEmployees, employees]);

    const handleDelete = async () => {
        if (selectedEmployees.length === 0) {
            toast.error("Please select at least one employee to delete.");
            return;
        }
        try {
            await Promise.all(selectedEmployees.map(async (employeeId) => {
                await deleteEmployee(employeeId);
            }));
            toast.success("Selected employees deleted successfully!");
            setSelectedEmployees([]);
            setIsAllSelected(false);
        } catch (error) {
            toast.error("Failed to delete selected employees.");
            console.error("error deleting employees", error);
        }
    };

    const toggleSelectEmployee = (employeeId: string) => {
        if (selectedEmployees.includes(employeeId)) {
            setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
            setIsAllSelected(false);
        } else {
            setSelectedEmployees([...selectedEmployees, employeeId]);
        }
    };

    const toggleSelectAll = () => {
        setIsAllSelected(!isAllSelected);
        if (!isAllSelected) {
            setSelectedEmployees(employees.map(employee => employee.id));
        } else {
            setSelectedEmployees([]);
        }
    };

    return (
        <div className='h-full w-full bg-white sm:rounded-2xl shadow-lg backdrop-blur-xl ring-1 ring-black/5 p-8 '
          
        >
            {/* Top Section */}
            <div className="flex justify-between border-b mb-8 pb-4">
                <div>
                    <input 
                        className="me-3"
                        type="checkbox" 
                        name="select_all" 
                        id="listselectall" 
                        checked={isAllSelected}
                        onChange={toggleSelectAll} 
                    /> 
                    <label htmlFor="listselectall">Select All</label>
                </div>
                <div>
                    <button className="text-red-500" onClick={handleDelete}>Delete Employee</button>
                </div>
            </div>
            <div className="overflow-x-auto">
            <table className="table-fixed text-left w-full">
                    <thead >
                        <tr >
                            <th></th>
                            <th className="font-medium">Id</th>
                            <th className="font-medium">Name</th>
                            <th className="font-medium">Jabatan</th>
                            <th className="font-medium">Foto</th>
                            <th className="font-medium">Edit</th>
                        </tr>
                    </thead>

                        <tbody className="">
                            {employees.map((employee) => (
                                <tr key={employee.id} className=" ">
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            id={`checkbox_${employee.id}`} 
                                            checked={selectedEmployees.includes(employee.id)}
                                            onChange={() => toggleSelectEmployee(employee.id)}
                                        />
                                    </td>
                                    <td className="font-light">{employee.id}</td>
                                    <td className="font-light">{employee.name}</td>
                                    <td className="font-light">{employee.jabatan}</td>
                                    <td className="flex  items-center">
                                        <img className="max-w-20 max-h-30 " src={employee.fotoURL} alt={`${employee.name}${employee.fotoURL}`}/>
                                    </td>
                                    <td className="">
                                        <Link href={`/Admin/Dashboard/member/${employee.id}`}>
                                            <FiEdit2 />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                </table>
            </div>
           

        </div>
    );
};

export default EmployeeList;
