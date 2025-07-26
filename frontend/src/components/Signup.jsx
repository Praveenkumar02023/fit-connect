import { useRef, useContext } from "react";
import { KeyRoundIcon, Mail, User } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { StoreContext } from "../Context/StoreContext";
import NavbarLink from "./LandingPage/TextComponent";
import Footer from "./LandingPage/Footer";
import Navbar from "./User-Dashboard/Navbar";

const Signup = () => {
  const nameRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const genderRef = useRef(null);
  const passwordRef = useRef(null);

  const { role } = useParams();
  let token;

  const navigate = useNavigate();
  const { url, setToken } = useContext(StoreContext);

  const currentRole = role === "trainer" ? "Trainer" : "User"; // fallback to User

  const handleSignup = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (currentRole === "User") {
      const name = nameRef.current?.value;
      const gender = genderRef.current?.value;

      try {
        const res = await axios.post(`${url}/api/v1/user/signup`, {
          name,
          email,
          password,
          gender,
        });

        token = res.data.token;
        if (res.status !== 201) {
          toast.error("Signup failed :(");
          return;
        }

        navigate("/user/feed");
        toast.success("Sign up successful :)");
      } catch (error) {
        console.log(error);
      }
    }

    if (currentRole === "Trainer") {
      const firstName = firstNameRef.current?.value;
      const lastName = lastNameRef.current?.value;
      
      try {
        const res = await axios.post(`${url}/api/v1/trainer/signup`, {
          firstName,
          lastName,
          email,
          password,
        });

        if (res.status !== 201) {
          toast.error("Signup failed :(");
          return;
        }

        setToken(res.data.token);
        navigate("/trainer/");
        toast.success("Sign up successful :)");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Navbar place="auth" />
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-violet-100 flex flex-col overflow-hidden">
      {/* Navbar */}
      <NavbarLink />

      {/* Background Blurs */}
      <div className="h-full w-full absolute inset-0 -z-10">
        <div className="absolute bottom-40 right-20 h-24 w-24 rounded-full bg-pink-300 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 left-40 h-48 w-48 rounded-full bg-green-200 blur-2xl animate-pulse"></div>
        <div className="absolute top-10 right-80 h-16 w-16 rounded-full bg-blue-300 blur-2xl animate-pulse"></div>
        <div className="absolute top-40 left-20 h-24 w-24 rounded-full bg-amber-300 blur-2xl animate-pulse"></div>
      </div>

      {/* Signup Box */}
      <div className=" min-h-screen flex-grow flex items-center justify-center px-4 relative z-10">
        <div className="bg-white shadow-lg rounded-2xl w-[90%] max-w-sm flex flex-col items-center py-6 px-4">
         {/* Role Toggle */}
<div className="flex justify-center mb-6 gap-4">
  <button
    onClick={() => navigate("/signup/user")}
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
    onClick={() => navigate("/signup/trainer")}
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
            Sign Up as {currentRole}
          </h1>

          {/* User name */}
          {currentRole === "User" && (
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
          )}

          {/* Trainer name */}
          {currentRole === "Trainer" && (
            <div className="w-[80%] mb-4">
              <label className="text-sm flex items-center gap-1 mb-1">
                <User className="size-4" /> First Name
              </label>
              <input
                ref={firstNameRef}
                type="text"
                placeholder="First Name"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <label className="mt-3 text-sm flex items-center gap-1 mb-1">
                <User className="size-4" /> Last Name
              </label>
              <input
                ref={lastNameRef}
                type="text"
                placeholder="Last Name"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          )}

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

          {/* Gender for user */}
          {currentRole === "User" && (
            <div className="w-[80%] mb-4">
              <label className="text-sm mb-1 block">Gender</label>
              <select
                ref={genderRef}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

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


          {/* Sign Up Button */}
          <button
            onClick={handleSignup}
            className="w-[80%] py-2 mt-2 bg-violet-600 hover:bg-gray-800 text-white font-semibold rounded-md transition duration-300"
          >
            Sign Up
          </button>

          {/* Sign In Redirect */}
          <p className="text-sm mt-4">
            Already have an account?{" "}
            <Link to="/signin/user" className="text-violet-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
    </div>
  );
};

export default Signup;
