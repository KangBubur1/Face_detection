"use client"
import { removeSession } from "@/actions/auth-action";
import { links } from "@/lib/data";
import Link from "next/link";
import Image from 'next/image'
import React from "react";

const AdminSideBar = ({}) => {
    
    const handleSignOut = async () => {
        await removeSession();
    }

    return(
        <aside className="md:flex flex-col items-center pt-48  border h-full fixed w-48 xl:w-64 hidden  bg-black/95 ">

            {/* Logo */}
            <div className=" ">
                <Image
                src="/logo.png"
                width={200}
                height={100}
                alt="Logo"
                loading="lazy"
                />
            </div>

            {/* Menu navigation */}
            <div className="w-full pt-12 flex justify-center flex-1">
                <ul className="">
                    {
                        links.map((item, index) => (
                            <li
                                key={index}
                                className="mt-4 last:mb-4  px-4 rounded-lg ease-in-out transition-all hover:scale-105 font-extralight text-white"
                            >
                                <Link
                                className="flex items-center gap-x-2 text-base p-4"
                                    href = {item.hash}
                                >
                                    <i className="text-4xl">{item.icon}</i>
                                    {item.name}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>

            {/* Sign Out */}
            <div className="h-48">
                <button className="rounded-full  text-center py-2 px-14 text-red-500 transition ease-in-out font-light hover:scale-105" onClick={handleSignOut}>Sign Out</button>
            </div>
        </aside>
    )
}

export default AdminSideBar;