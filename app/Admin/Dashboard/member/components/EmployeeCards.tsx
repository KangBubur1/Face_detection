"use client"

import React, { useEffect, useState } from 'react';
import Card from './Card';
import { BsPeople } from 'react-icons/bs';
import { EmployeeProps, getEmployeeLate, getEmployeeOnTime, getEmployeesNotAbsentToday, getTotalEmployees } from '@/app/firebase/firebasehelper';

interface EmployeeCardProps {
    totalEmployees: number;
    notAttedance: number;
    onTime: number;
    late: number;
}

const EmployeeCard: React.FC<{employees: EmployeeProps[]}> = ( { employees }) => {
    const [data, setData] = useState<EmployeeCardProps>({
        totalEmployees: 0,
        notAttedance: 0,
        onTime: 0,
        late: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const totalEmployees = await getTotalEmployees();
                const notAttedance = await getEmployeesNotAbsentToday();
                const onTime = await getEmployeeOnTime();
                const late = await getEmployeeLate();
                setData({
                    totalEmployees,
                    notAttedance,
                    onTime,
                    late
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    },[employees]);
    return (
        <div className=" ">
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-y-4 gap-x-4 lg:flex  w-full lg:gap-x-10 items-center  p-4">
                <Card title="Total" value={data.totalEmployees} icon={BsPeople} />
                <Card title="Absent" value={data.notAttedance} icon={BsPeople} />
                <Card title="On time" value={data.onTime} icon={BsPeople} />
                <Card title="Late" value={data.late} icon={BsPeople} />
            </div>
        </div>
    );
};

export default EmployeeCard;
