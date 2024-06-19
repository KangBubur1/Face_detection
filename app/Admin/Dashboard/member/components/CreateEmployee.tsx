"use client"
import { EmployeeProps, isIdUnique, createEmployee } from '@/app/firebase/firebasehelper';
import Loading from '@/components/Loading';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const CreateEmployee: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [jabatan, setJabatan] = useState("");
    const [foto, setFoto] = useState<File | null>(null);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const idUnique = await isIdUnique(id);

            if (!idUnique) {
                toast.error('ID already exists. Please use a different ID');
                setIsLoading(false);
                return;
            }

            const employeeData: Omit<EmployeeProps, 'fotoURL'> = { id, name, jabatan}
            await createEmployee(employeeData, foto);

            toast.success('Successfully added employee!');

            // Reset form
            setName("");
            setId("");
            setJabatan("");
            setFoto(null);

            // Close modal
            toggleModal();

        } catch (e) {
            toast.error('Failed to add employee. Please try again.');
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section>
            <button 
                type="button" 
                onClick={toggleModal} 
                className="outline outline-1 hover:scale-105 transition-all rounded-lg text-sm px-4 py-2"
            >
                Create Employee
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="relative w-full max-w-2xl h-auto max-h-3/4 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
                        {/* Top section */}
                        <div className="flex justify-between w-full">
                            <h2 className="text-xl">Create Employee</h2>
                            <button 
                                type="button" 
                                onClick={toggleModal} 
                                disabled={isLoading}
                                className="hover:scale-105 transition-all rounded-lg text-sm px-4 py-2"
                            >
                                Close
                            </button>
                        </div>

                        {/* Form */}
                        <form className="mt-8 w-full" onSubmit={handleSubmit} id='formInputEmployee'>
                            <div className="mb-6">
                                <input 
                                    id='inputName'
                                    type="text"
                                    value={name} 
                                    className="rounded-lg indent-4 focus-within:outline-none shadow-lg w-full h-12 outline outline-1 outline-gray-500"
                                    placeholder="Name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-6">
                                <input 
                                    id='inputId'
                                    type="text"
                                    value={id} 
                                    className="rounded-lg indent-4 focus-within:outline-none shadow-lg w-full h-12 outline outline-1 outline-gray-500"
                                    placeholder="ID"
                                    onChange={(e) => setId(e.target.value)}
                                />
                            </div>
                            <div className="mb-6">
                                <input 
                                    id='inputJabatan'
                                    type="text"
                                    value={jabatan} 
                                    className="rounded-lg indent-4 focus-within:outline-none shadow-lg w-full h-12 outline outline-1 outline-gray-500"
                                    placeholder="Jabatan"
                                    onChange={(e) => setJabatan(e.target.value)}
                                />
                            </div>
                            <div className="mb-12">
                                <input 
                                    id='inputFoto'
                                    type="file"
                                    className=" w-full h-12 outline-gray-500 "
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className='flex justify-center'>
                                {
                                    isLoading ?  <Loading/>: 
                                    <button 
                                    type="submit" 
                                    className="w-full rounded-lg text-sm px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 transition-all "
                                    > Submit </button>
                                    
                                }
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CreateEmployee;
