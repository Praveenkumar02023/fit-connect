import React, { useRef } from 'react';
import { Mail, KeyRoundIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Signin = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSignin = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    console.log('Email:', email);
    console.log('Password:', password);
    
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-cyan-50 to-blue-50">
    
      <div className="h-full w-full absolute inset-0">
        <div className="absolute bottom-40 right-20 h-24 w-24 rounded-full bg-violet-300 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 left-40 h-48 w-48 rounded-full bg-cyan-200 blur-2xl animate-pulse"></div>
        <div className="absolute top-10 right-80 h-16 w-16 rounded-full bg-blue-300 blur-2xl animate-pulse"></div>
        <div className="absolute top-40 left-20 h-24 w-24 rounded-full bg-blue-300 blur-2xl animate-pulse"></div>
      </div>

      
      <div className="relative bg-white shadow-lg rounded-2xl h-60vh w-[25%] flex flex-col items-center justify-start py-6 px-4 z-10">
        <h1 className="text-2xl font-semibold text-center w-full mb-4">
          Sign In to your account
        </h1>

        <div className="w-[80%] mb-4">
          <label className="text-sm flex items-center gap-1 mb-1">
            <Mail className="size-4" /> Email
          </label>
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="w-[80%] mb-4">
          <label className="text-sm flex items-center gap-1 mb-1">
            <KeyRoundIcon className="size-4" /> Password
          </label>
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <button
          onClick={handleSignin}
          className="w-[80%] py-2 bg-violet-600 hover:bg-gray-800 text-white font-semibold rounded-md transition duration-300"
        >
          Sign In
        </button>

        <p className="text-sm mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-violet-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
