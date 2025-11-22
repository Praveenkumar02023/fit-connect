import { Mail, KeyRoundIcon, Eye, EyeOff } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { useRef, useContext, useState, useEffect } from 'react';
import { StoreContext } from '../Context/StoreContext';

import Navbar from '../components/User-Dashboard/Navbar'; 
import Footer from '../components/LandingPage/Footer';

const Signin = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { role } = useParams();
  const navigate = useNavigate();
  const { url, setToken } = useContext(StoreContext);

  // local UI state
  const [activeRole, setActiveRole] = useState(role === 'trainer' ? 'Trainer' : 'User');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // keep UI in sync if route param changes
  useEffect(() => {
    setActiveRole(role === 'trainer' ? 'Trainer' : 'User');
  }, [role]);

  const switchTo = (r) => {
    // update local state and route (this will re-render component with correct params)
    setActiveRole(r);
    if (r === 'Trainer') navigate('/signin/trainer');
    else navigate('/signin/user');
  };

  const handleSignin = async () => {
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    // basic frontend validation (non-blocking, just nicer UX)
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      let res;

      if (activeRole === "Trainer") {
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
        toast.error(res.data?.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setToken(res.data.token);
      toast.success(res.data?.message || "Signin successful");

      if (activeRole === "Trainer") {
        navigate("/trainer/");
      } else {
        navigate("/user/feed");
      }

    } catch (error) {
      // prefer backend message if present
      const msg = error?.response?.data?.message || error.message || "Signin failed";
      toast.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
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

          {/* ROLE TOGGLE – Pill Slider */}
          <div className="w-full flex justify-center mb-6">
            <div
              role="tablist"
              aria-label="Select role"
              className="relative inline-flex p-1 bg-gray-100 rounded-full"
              style={{ padding: '4px' }}
            >
              {/* Sliding knob */}
              <div
                aria-hidden
                className={`absolute top-1 bottom-1 w-1/2 bg-violet-500 rounded-full transition-transform duration-300`}
                style={{
                  transform: activeRole === 'Trainer' ? 'translateX(100%)' : 'translateX(0%)',
                  width: '50%'
                }}
              />

              {/* Buttons (on top of the knob) */}
              <button
                onClick={() => switchTo('User')}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200
                  ${activeRole === 'User' ? 'text-white' : 'text-gray-700'}`}
                aria-pressed={activeRole === 'User'}
                aria-label="Sign in as user"
              >
                👤 User
              </button>

              <button
                onClick={() => switchTo('Trainer')}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200
                  ${activeRole === 'Trainer' ? 'text-white' : 'text-gray-700'}`}
                aria-pressed={activeRole === 'Trainer'}
                aria-label="Sign in as trainer"
              >
                💪 Trainer
              </button>
            </div>
          </div>

          <h1 className="text-xl font-semibold text-center w-full mb-4">
            Sign In as {activeRole}
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
              aria-label="Email"
            />
          </div>

          {/* Password Input with iOS-style eye pill */}
          <div className="w-[80%] mb-4 relative">
            <label className="text-sm flex items-center gap-1 mb-1">
              <KeyRoundIcon className="size-4" /> Password
            </label>

            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 pr-12"
                aria-label="Password"
              />

              {/* iOS-style eye toggle pill */}
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center px-2 py-1 rounded-full bg-white shadow-md hover:shadow-lg focus:outline-none"
                style={{ width: '38px', height: '26px' }}
              >
                <div className="flex items-center justify-center">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignin}
            disabled={loading}
            className="w-[80%] py-2 bg-violet-600 hover:bg-gray-800 text-white font-semibold rounded-md transition duration-300 flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : null}
            {loading ? "Signing in..." : "Sign In"}
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
