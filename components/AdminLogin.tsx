"use client"
import { auth } from "@/app/firebase/config";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/actions/auth-action";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      if (res) { 
        setEmail('');
        setPassword('');
        await createSession(res.user.uid);
        router.push('/Admin/Dashboard'); 
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <section className="flex flex-col items-center w-96 h-96 bg-white/10 sm:rounded-2xl shadow-lg backdrop-blur-3xl ring-1 ring-black/5 justify-center">
      {/* Form */}
      <form className="mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
        <div className="justify-center flex h-12 mb-8">
          <input 
            type="email" 
            value={email} 
            className="rounded-lg indent-4 focus-within:outline-none w-72 shadow-lg"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="justify-center flex h-12 mb-8">
          <input 
            type="password" 
            value={password}
            className="rounded-lg indent-4 focus-within:outline-none w-72 shadow-lg"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="justify-center flex">
          <button
            className="w-72 select-none rounded-lg bg-indigo-400/80 py-3 px-6 text-center align-middle text-xs font-bold uppercase text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="submit"
            data-ripple-light="true"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.96 7.96 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Login'}
          </button>
        </div>
        {error && <p className="mt-4 text-red-500">{error.message}</p>}
      </form>
    </section>
  );
};

export default Login;
