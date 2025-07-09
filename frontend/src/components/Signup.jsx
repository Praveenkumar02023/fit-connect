import React, { useRef } from 'react';
import { KeyRoundIcon, Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSignup = () => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    console.log('Signup Info:', { name, email, password });
    // Add signup logic here
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-blue-50 to-violet-100">
      {/* Background blobs */}
      <div className="h-full w-full absolute inset-0">
        <div className="absolute bottom-40 right-20 h-24 w-24 rounded-full bg-pink-300 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 left-40 h-48 w-48 rounded-full bg-green-200 blur-2xl animate-pulse"></div>
        <div className="absolute top-10 right-80 h-16 w-16 rounded-full bg-blue-300 blur-2xl animate-pulse"></div>
        <div className="absolute top-40 left-20 h-24 w-24 rounded-full bg-amber-300 blur-2xl animate-pulse"></div>
      </div>

      {/* Signup card */}
      <div className="relative bg-white shadow-lg rounded-2xl h-[55%] w-[25%] flex flex-col items-center justify-start py-6 px-4 z-10">
        <h1 className="text-2xl font-semibold text-center w-full mb-4">
          Create your account
        </h1>

        {/* Name */}
        <div className="w-[80%] mb-4">
          <label className="text-sm flex items-center gap-1 mb-1">
            <User className="size-4" /> Name
          </label>
          <input
            ref={nameRef}
            type="text"
            placeholder="Name"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Email */}
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

        {/* Password */}
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

        {/* Button + Link */}
        <button
          onClick={handleSignup}
          className="w-[80%] py-2 mt-2 bg-violet-600 hover:bg-gray-800 text-white font-semibold rounded-md transition duration-300"
        >
          Sign Up
        </button>

        <p className="text-sm mt-4">
          Already have an account?{' '}
          <Link to="/signin" className="text-violet-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
