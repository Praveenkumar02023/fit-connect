import { Heart, Shell } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="relative mt-12 px-12 h-auto w-full bg-gray-900">
      <div className="flex flex-col md:flex-row py-6 md:py-10 flex-wrap justify-between text-white gap-y-8">
        {/* Left Side - Branding */}
        <div className="flex flex-col gap-y-4 w-full md:w-1/2 px-6">
          <h2 className="text-4xl font-bold flex items-center gap-2">
            <Shell className="size-8" /> FitConnect
          </h2>
          <p className="text-gray-400">
            Connect with certified trainers, join exciting fitness events, and
            reach your goals with the best support — all in one platform.
          </p>
          <p className="text-gray-400 pt-2">
            © 2025 FitConnect. All rights reserved.
          </p>
        </div>

        {/* Right Side - Centered Company Links */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center gap-4 px-6">
          <h1 className="text-lg font-semibold">Company</h1>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/user/about" className="hover:underline text-gray-300 text-sm">
              About Us
            </Link>
            <Link to="/user/contact" className="hover:underline text-gray-300 text-sm">
              Contact
            </Link>
            <Link to="/user/policy" className="hover:underline text-gray-300 text-sm">
              Privacy Policy
            </Link>
            <Link to="/user/terms" className="hover:underline text-gray-300 text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full border-t border-gray-800 py-4 text-white text-center text-sm">
        <p className="flex items-center justify-center">
          Built with <Heart className="mx-2 size-5 text-red-500 fill-red-500" />
          by <span className="ml-1 font-medium">Team 31</span>.
        </p>
      </div>
    </div>
  );
};

export default Footer;
