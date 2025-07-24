
import { useNavigate } from "react-router-dom";
import { Shell } from "lucide-react"; // adjust based on your icon
import React from "react";

const SigninNavbar = () => {
  const navigate = useNavigate();

  return (
  <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-14 h-16 w-full border-b border-gray-400 flex justify-between items-center transition-all duration-300 ease-in-out">
        <div className="flex items-center text-black font-bold text-2xl">
          <Shell />
          <h1 className="ml-1">FitConnect</h1>
        </div>
      <div className="flex gap-x-6 items-center text-sm font-semibold text-gray-800">
        <button onClick={() => navigate("/")} className="hover:text-blue-600 transition">Home</button>
        <button onClick={() => navigate("/user/about")} className="hover:text-blue-600 transition">About Us</button>
        <button onClick={() => navigate("/user/contact")} className="hover:text-blue-600 transition">Contact</button>
      </div>
    </div>
  );
};

export default SigninNavbar;
