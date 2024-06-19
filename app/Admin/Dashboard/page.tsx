"use client"
import { EmployeeProps, getAttendanceList } from "@/app/firebase/firebasehelper";
import EmployeeCard from "./member/components/EmployeeCards";
import { useEffect, useState } from "react";
import { IoMegaphoneOutline } from "react-icons/io5";
import {DatePicker, DateValue} from "@nextui-org/react";
import { getLocalTimeZone, today } from "@internationalized/date";

export default function AdminPage() {
    let defaultDate = today(getLocalTimeZone());

    const [ employees, setEmployees ] = useState<EmployeeProps[]>([]);
    const [ datePicker, setDatePicker ]  = useState<DateValue>(defaultDate);

    
    const currDate = new Date();
    const day = currDate.getDate();
    const month = currDate.toLocaleString('default', { month: 'long' });
    const year = currDate.getFullYear();


    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const formattedDate = datePicker.toString(); // Format datePicker to your desired string format
                const attendanceData = await getAttendanceList(formattedDate);
                setEmployees(attendanceData);
            } catch (error) {
                console.error("Error fetching attendance data", error)
            }
        }
        fetchAttendance();
    },[datePicker])

    return(
        <section className="p-8 " >
            <div className="col-span-3  p-4 ">
                <h1 className="text-4xl">Dashboard</h1>
            </div>

            <div className="flex flex-col pt-4 2xl:flex-row 2xl:items-center bg-white rounded-lg border ring-black/5 justify-evenly drop-shadow-sm">
                <div className="flex">
                    <div className="p-4  sm:ms-4 sm:me-6 ">
                        <IoMegaphoneOutline className="w-12 h-12 p-2 border bg-blue-500 rounded-full text-white "/>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl pb-1 flex"><span className="hidden sm:block">Today, </span>  {month} {day} {year}</h2>
                        <p className="text-sm font-light text-slate-400">This show daily data in real time</p>
                    </div>
                </div>
                
                <EmployeeCard employees={employees}/>
            </div>

            <div className="w-full h-full border mt-12 bg-white rounded-lg ring-black/5 p-8 overflow-hidden" >
                <div className="flex justify-between pb-8">
                    <div>
                        <h1>Attendance</h1>
                        <p className="text-sm font-light text-slate-400 hidden sm:block">Keep track employee attendance</p>
                    </div>
                    <div className=""  >
                        <DatePicker variant="bordered" value={datePicker} onChange={setDatePicker}  />
                    </div>
                </div>

                <div className="h-auto ">
                    <div className="flex justify-evenly p-3 ">
                        {employees.map((employee) => (
                            <div key={employee.id} className="flex w-full justify-evenly p-3 border-t">
                            <div>
                                <img src={employee.fotoURL} alt={employee.name} className="h-16 w-16 rounded-full object-cover" />
                            </div>
                            <div className="flex items-center">{employee.name}</div>
                            <div className="flex items-center">{employee.date}</div>
                            <div className="flex items-center">{employee.clockedIn}</div>
                            </div>
                        ))}
                    </div>
                </div>
               
            </div>
        </section>
    )
}
