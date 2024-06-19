import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "@firebase/firestore";
import { db, storage } from "./config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export type EmployeeProps = {
    clockedIn: string;
    date: string;
    id: string,
    name: string,
    jabatan: string,
    fotoURL?: string,
}

export const getTotalEmployees = async () => {
    const employeeCollection = collection(db, "Employee");
    const snapshot = await getDocs(employeeCollection);
    return snapshot.size;
}

export const getEmployeesNotAbsentToday = async () => {
    const attendanceCollection = collection(db, "attendance");
    const employeeCollection = collection(db, "Employee");
    const date = new Date().toISOString().split('T')[0];

    let notAbsentCount = 0;

    try {
        // Langkah 1: Ambil semua dokumen kehadiran untuk hari ini dari koleksi attendance
        const attendanceQuery = query(attendanceCollection, where("date", "==", date));
        const attendanceSnapshot = await getDocs(attendanceQuery);
        const presentEmployees = attendanceSnapshot.docs.map(doc => doc.data().name);

        // Langkah 2: Ambil semua dokumen karyawan dari koleksi Employee
        const employeeSnapshot = await getDocs(employeeCollection);
        const allEmployees = employeeSnapshot.docs.map(doc => doc.data().name);

        // Langkah 3: Periksa kehadiran setiap karyawan
        allEmployees.forEach(employee => {
            if (!presentEmployees.includes(employee)) {
                notAbsentCount++;
            }
        });

        return notAbsentCount;
    } catch (error) {
        console.error("Error fetching attendance or employees: ", error);
        throw error;
    }
};

export const getEmployeeOnTime = async () => {
    const attendanceCollection = collection(db, "attendance");
    const date = new Date().toISOString().split('T')[0];
    try {
        const attendanceQuery = query(attendanceCollection, where("date", "==", date), where("clockedIn", "<=","08:00:00"));
        const attendanceSnapshot = await getDocs(attendanceQuery);
        
        return attendanceSnapshot.size;
    } catch (error) {
        console.error("Error fetching Employee On time", error);
        return 0;
    }
}

export const getEmployeeLate = async () => {
    const attendanceCollection = collection(db, "attendance");
    const date = new Date().toISOString().split('T')[0];
    try {
        const attendanceQuery = query(attendanceCollection, where("date", "==", date), where("clockedIn", ">","08:00:00"));
        const attendanceSnapshot = await getDocs(attendanceQuery);
        
        return attendanceSnapshot.size;
    } catch (error) {
        console.error("Error fetching Employee On time", error);
        return 0;
    }
}

export const getAttendanceList = async (date: string): Promise<EmployeeProps[]> => {
    const attendanceCollection = collection(db, "attendance");
    const employeeCollection = collection(db, "Employee");

    try {
        const attendanceQuery = query(attendanceCollection, where("date", "==", date));
        const attendanceSnapshot = await getDocs(attendanceQuery);

        if (attendanceSnapshot.empty) {
            return [];
        }

        const employeeIds = attendanceSnapshot.docs.map(doc => doc.data().id);

        // Get all employees with the specified ids
        const employeeQuery = query(employeeCollection, where("id", "in", employeeIds));
        const employeeSnapshot = await getDocs(employeeQuery);

        const attendanceList = attendanceSnapshot.docs.map(attendanceDoc => {
            const attendanceData = attendanceDoc.data();
            const employeeData = employeeSnapshot.docs.find(empDoc => empDoc.data().id === attendanceData.id)?.data();

            return {
                ...employeeData,
                ...attendanceData,
            };
        }).filter(item => item != null);

        return attendanceList as EmployeeProps[];
    } catch (error) {
        console.error("Error fetching attendance data", error);
        return [];
    }
}

export const isIdUnique = async (id: string): Promise<boolean> => {
    const q = query(collection(db, "Employee"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
}




export const getEmployeeList = (callback: (employees: EmployeeProps[]) => void) => {
    const unsubscribe = onSnapshot(collection(db, "Employee"), (snapshot) => {
        const employees = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as EmployeeProps[];
        callback(employees);
    })
    return unsubscribe;
};


export const getEmployee = async (employeeId: string): Promise<EmployeeProps | null> => {
    try {
        const q = query(collection(db, 'Employee'), where('id', '==', employeeId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const employeeData = querySnapshot.docs[0].data();
            return { id: querySnapshot.docs[0].id, ...employeeData } as EmployeeProps;
        } else {
            console.log('Employee not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching employee:', error);
        throw error;
    }
};

// Fungsi untuk mengupdate data karyawan
export const updateEmployee = async (employee: EmployeeProps): Promise<void> => {
    try {
        // Query to find the employee document in Employee collection
        const employeeQuery = query(collection(db, 'Employee'), where('id', '==', employee.id));
        const employeeSnapshot = await getDocs(employeeQuery);

        // Query to find the attendance documents in attendance collection
        const attendanceQuery = query(collection(db, 'attendance'), where('id', '==', employee.id));
        const attendanceSnapshot = await getDocs(attendanceQuery);

        // Update Employee collection
        if (!employeeSnapshot.empty) {
            const employeeDocRef = employeeSnapshot.docs[0].ref;
            await updateDoc(employeeDocRef, {
                name: employee.name,
                jabatan: employee.jabatan,
                // Add other fields that need to be updated
            });
            console.log('Employee updated successfully in Employee collection!');
        } else {
            console.log('Employee not found in Employee collection');
        }

        // Update attendance collection
        if (!attendanceSnapshot.empty) {
            // Update each document in attendance collection where id matches
            for (const doc of attendanceSnapshot.docs) {
                const attendanceDocRef = doc.ref;
                await updateDoc(attendanceDocRef, {
                    name: employee.name,
                });
            }
            console.log('Employee name updated successfully in attendance collection!');
        } else {
            console.log('Employee not found in attendance collection');
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};

export  const createEmployee = async (employee: Omit<EmployeeProps, 'fotoURL'>, foto: File | null ): Promise<void> => {
    let fotoURL = "";
    if (foto) {
        const fotoRef = ref(storage, `fotos/${foto.name}`);
        const snapshot = await uploadBytes(fotoRef, foto);
        fotoURL = await getDownloadURL(snapshot.ref);
    }

    await addDoc(collection(db, "Employee"), {
        ...employee,
        fotoURL
    });
}

export const deleteEmployee = async (employeeId: string): Promise<void> => {
    try {
        const q = query(collection(db, "Employee"), where("id", "==", employeeId));

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await deleteDoc(docRef);
            console.log('Employee deleted successfully!');
        } else {
            console.log('Employee with provided ID not found!');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error; 
    }
}

