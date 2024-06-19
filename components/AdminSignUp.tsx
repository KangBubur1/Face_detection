"use client"
import { auth } from "@/app/firebase/config";

import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth"
import { useState } from "react";

const AdminSignUp  = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const [ createUserWithEmailAndPassword ] = useCreateUserWithEmailAndPassword(auth);

  const handleSignUp = async () => {
      try{
         const res = await createUserWithEmailAndPassword(email,password);
         console.log({res})
         setEmail('');
         setPassword('');
      } catch(e){
        console.error(e)
      }
  };

  return(
      <section className="flex flex-col   items-center  w-96 h-96 bg-white/10 sm:rounded-2xl shadow-lg  backdrop-blur-3xl ring-1 ring-black/5">
          <div className="mt-12 ">
              <h1 className="font-medium text-4xl ">Create Admin</h1>
          </div>
          
          {/* Form */}
          <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <div className="justify-center flex h-12 mb-8">
              <input 
                  type="text"
                  value={email} 
                  className="rounded-lg indent-4 focus-within:outline-none w-72 shadow-lg before:[' '] after:placeholder:''"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="justify-center flex h-12 mb-8">
              <input 
                  type="password" 
                  value={password}
                  className="rounded-lg indent-4 focus-within:outline-none w-72 shadow-lg before:[' '] after:placeholder:''"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="justify-center flex">
              <button
                className=" w-72 select-none rounded-lg bg-indigo-400/80 py-3 px-6 text-center align-middle  text-xs font-bold uppercase text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none "
                type="button"
                data-ripple-light="true"
                onClick={() => handleSignUp()}
              >
                Create Account
              </button>
            </div>


        </form>
      </section>
  )
}

export default AdminSignUp;