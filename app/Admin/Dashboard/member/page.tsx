"use client"

import { Toaster } from "react-hot-toast";
import CreateEmployee from "./components/CreateEmployee";
import EmployeeCard from "./components/EmployeeCards";
import EmployeeList from "./components/EmployeeList";
import { getEmployeeList, EmployeeProps } from "@/app/firebase/firebasehelper";
import { useEffect, useState } from "react";


export default function MemberPage() {
    const [ employees, setEmployees ] = useState<EmployeeProps[]>([]);

    useEffect(() => {
        const unsubscribe = getEmployeeList(setEmployees);
        return () => unsubscribe();
    },[])
    return (
        <section className="p-8 grid  h-full grid-rows-[0fr_2fr]">
            <Toaster/>
            {/* Top */}
            <div className="flex flex-col sm:flex-row sm:justify-between p-4 sm:items-center">
                {/* left */}
                <div className="col-span-3 pb-4 sm:pb-0">
                    <h1 className="text-3xl ">Manage Employee</h1>
                </div>

                {/* Right */}
                
                <CreateEmployee/>
            </div>

            {/* Bottom */}
            <div className="items-center  p-4  ">
                <EmployeeList employees={employees}/>
            </div>
        </section>
    );
}
