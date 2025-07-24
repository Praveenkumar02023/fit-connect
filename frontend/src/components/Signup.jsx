import { useRef , useContext} from "react";
import { KeyRoundIcon, Mail, User } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { StoreContext } from "../Context/StoreContext";



const Signup = () => {
  const nameRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const genderRef = useRef(null);
  const passwordRef = useRef(null);
  const sessionPriceRef = useRef(null);
  const monthPriceRef = useRef(null);


  const { role } = useParams();
  let token ;

  const navigate = useNavigate();
  const {url , setToken} = useContext(StoreContext);

  const currentRole = role === "trainer" ? "Trainer" : "User"; // fallback to User

  const handleSignup = async () => {
   
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    

    if (currentRole === "User") {
      const name = nameRef.current?.value;
      const gender = genderRef.current?.value;

      try {
        const res = await axios.post(
          `${url}/api/v1/user/signup`,
          {
            name: name,
            email: email,
            password: password,
            gender: gender,
          }
        );


        token = res.data.token;

        if (res.status != 201) {
          toast.error("Signup failed :(");
          return;
        }

        navigate("/feed");
        toast.success("Sign up successfull :)");
      } catch (error) {
        console.log(error);
      }
    }

    if (currentRole === "Trainer") {
      const firstName = firstNameRef.current?.value;
      const lastName = lastNameRef.current?.value;
      const pricing_perSession = Number(sessionPriceRef.current?.value);
      const pricing_perMonth = Number(monthPriceRef.current?.value);

      try {
        const res = await axios.post(
         `${url}/api/v1/trainer/signup`,
          {
            firstName,
            lastName ,
            email,
            password,
           pricing_perSession,
           pricing_perMonth,
          }
        );

        console.log(res);

        if (res.status != 201) {
          toast.error("Signup failed :(");
          return;
        }

        navigate("/trainer/dashboard");
        setToken(res.data.token);
        toast.success("Sign up successfull :)");
      } catch (error) {
        console.log(error);
      }
    }
  };
 

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-blue-50 to-violet-100">
      {/* Background Blurs */}
      <div className="h-full w-full absolute inset-0">
        <div className="absolute bottom-40 right-20 h-24 w-24 rounded-full bg-pink-300 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 left-40 h-48 w-48 rounded-full bg-green-200 blur-2xl animate-pulse"></div>
        <div className="absolute top-10 right-80 h-16 w-16 rounded-full bg-blue-300 blur-2xl animate-pulse"></div>
        <div className="absolute top-40 left-20 h-24 w-24 rounded-full bg-amber-300 blur-2xl animate-pulse"></div>
      </div>

      {/* Signup Box */}
      <div className="relative bg-white shadow-lg rounded-2xl w-[90%] max-w-sm flex flex-col items-center justify-start py-6 px-4 z-10">
        {/* Role Toggle */}
        <div className="flex justify-center mb-4 gap-4">
          <button
            onClick={() => navigate("/signup/user")}
            className={`px-4 py-1 rounded-full border ${
              currentRole === "User"
                ? "bg-violet-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            User
          </button>
          <button
            onClick={() => navigate("/signup/trainer")}
            className={`px-4 py-1 rounded-full border ${
              currentRole === "Trainer"
                ? "bg-violet-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Trainer
          </button>
        </div>

        <h1 className="text-xl font-semibold text-center w-full mb-4">
          Sign Up as {currentRole}
        </h1>

        {/* Name Input */}
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
        {currentRole === "Trainer" && (
          <div className="w-[80%] mb-4 ">
            <label className="text-sm flex items-center gap-1 mb-1">
              <User className="size-4" /> FirstName
            </label>
            <input
              ref={firstNameRef}
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <label className="mt-3 text-sm flex items-center gap-1 mb-1">
              <User className="size-4" /> LastName
            </label>
            <input
              ref={lastNameRef}
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        )}

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
        
        {/* Gender for User only */}
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

        {/* Extra Fields for Trainer */}
        {currentRole === "Trainer" && (
          <>
            <div className="w-[80%] mb-4">
              <label className="text-sm mb-1 block">
                Pricing Per Session ($)
              </label>
              <input
                ref={sessionPriceRef}
                type="number"
                placeholder="e.g., 500"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="w-[80%] mb-4">
              <label className="text-sm mb-1 block">
                Pricing Per Month ($)
              </label>
              <input
                ref={monthPriceRef}
                type="number"
                placeholder="e.g., 5000"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSignup}
          className="w-[80%] py-2 mt-2 bg-violet-600 hover:bg-gray-800 text-white font-semibold rounded-md transition duration-300"
        >
          Sign Up
        </button>

        {/* Redirect Link */}
        <p className="text-sm mt-4">
          Already have an account?{" "}
          <Link to="/signin/user" className="text-violet-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;