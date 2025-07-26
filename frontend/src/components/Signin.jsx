import { Mail, KeyRoundIcon } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { useRef, useContext } from 'react';
import { StoreContext } from '../Context/StoreContext';

import Navbar from '../components/User-Dashboard/Navbar'; // adjust path as needed
import Footer from '../components/LandingPage/Footer'; // adjust path as needed

const Signin = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { role } = useParams();
  const navigate = useNavigate();
  const { url, setToken } = useContext(StoreContext);

  const currentRole = role === 'trainer' ? 'Trainer' : 'User';

  const handleSignin = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      let res;

      if (currentRole === "Trainer") {
        res = await axios.post(`${url}/api/v1/trainer/signin`, {
          email,
          password
        });
      } else {
        res = await axios.post(`${url}/api/v1/user/signin`, {
          email,
          password
        });
      }

      if (res.status !== 200) {
        toast.error(res.message || "Something went wrong");
        return;
      }

      setToken(res.data.token);
      toast.success(res.message || "Signin successful");

      if (currentRole === "Trainer") {
        navigate("/trainer/");
      } else {
        navigate("/user/feed");
      }

    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <>
      <Navbar place="auth" />

      <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-violet-100 via-cyan-50 to-blue-50 pt-10 pb-20">
        {/* Animated Background */}
        <div className="h-full w-full absolute inset-0 z-0">
          <div className="absolute bottom-40 right-20 h-24 w-24 rounded-full bg-violet-300 blur-2xl animate-pulse opacity-50"></div>
          <div className="absolute bottom-40 left-40 h-48 w-48 rounded-full bg-cyan-200 blur-2xl animate-pulse opacity-50"></div>
          <div className="absolute top-10 right-80 h-16 w-16 rounded-full bg-blue-300 blur-2xl animate-pulse opacity-50"></div>
          <div className="absolute top-40 left-20 h-24 w-24 rounded-full bg-blue-300 blur-2xl animate-pulse opacity-50"></div>
        </div>

        {/* Login Box */}
        <div className="relative z-10 bg-white shadow-lg rounded-2xl w-[90%] max-w-sm flex flex-col items-center justify-start py-6 px-4">
          {/* Role Toggle */}
          {/* Role Toggle */}
<div className="flex justify-center mb-6 gap-4">
  <button
    onClick={() => navigate("/signin/user")}
    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform border shadow-sm
      ${
        currentRole === "User"
          ? "bg-violet-500 text-white scale-105 ring-2 ring-violet-500 shadow-md animate-bounce"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      }`}
  >
    👤 User
  </button>

  <button
    onClick={() => navigate("/signin/trainer")}
    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform border shadow-sm
      ${
        currentRole === "Trainer"
          ? "bg-violet-500 text-white scale-105 ring-2 ring-violet-500 shadow-md animate-bounce"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      }`}
  >
    💪 Trainer
  </button>
</div>


          <h1 className="text-xl font-semibold text-center w-full mb-4">
            Sign In as {currentRole}
          </h1>

          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Sign In Button */}
          <button
            onClick={handleSignin}
            className="w-[80%] py-2 bg-violet-600 hover:bg-gray-800 text-white font-semibold rounded-md transition duration-300"
          >
            Sign In
          </button>

          <p className="text-sm mt-4">
            Don&apos;t have an account?{' '}
            <Link to="/signup/user" className="text-violet-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Signin;
