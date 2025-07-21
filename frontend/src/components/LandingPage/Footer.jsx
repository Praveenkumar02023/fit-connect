import { Dumbbell, Heart, Shell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="mt-12 px-12 h-[40vh] w-full bg-gray-900">
      <div className="flex py-4 h-[75%] flex-wrap">
        {/* Left Side - Branding */}
        <div className="gap-y-4 flex flex-col justify-between text-white w-full md:w-1/2 p-8">
          <h2 className="text-5xl font-bold text-white flex items-center gap-2">
            <Shell className="size-10 text-white " /> FitConnect
          </h2>
          <p className="pt-2 text-gray-400">
            Connect with certified trainers, join exciting fitness events, and reach your goals with the best support — all in one platform.
          </p>
          <p className="pt-8 text-gray-400">© 2025 FitConnect. All rights reserved.</p>
        </div>

        {/* Right Side - Links */}
        <div className="text-white w-full md:w-1/2 flex items-center justify-evenly flex-wrap md:flex-nowrap gap-y-8 md:gap-x-12 p-8">
          <div className="flex flex-col gap-y-3">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="ml-2 flex flex-col gap-y-2">
              <li className="hover:underline"><Link to="/">Find Trainers</Link></li>
              <li className="hover:underline"><Link to="/">Explore Events</Link></li>
              <li className="hover:underline"><Link to="/">FitConnect Feed</Link></li>
              <li className="hover:underline"><Link to="/">Join as Trainer</Link></li>
            </ul>
          </div>
          <div className="ml-8 flex flex-col gap-y-3">
            <h3 className="text-lg font-bold">Company</h3>
            <ul className="ml-2 flex flex-col gap-y-2">
              <li className="hover:underline"><Link to="/about">About Us</Link></li>
              <li className="hover:underline"><Link to="/contact">Contact</Link></li>
              <li className="hover:underline"><Link to="/policy">Privacy Policy</Link></li>
              <li className="hover:underline"><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="h-[25%] w-full border-t border-gray-800 flex justify-center text-white items-center text-sm text-center">
        <p className="flex items-center">
          Built with <Heart className="mx-2 size-5 text-red-500 fill-red-500" /> by <span className="ml-1 font-medium">Team 31</span>.
        </p>
      </div>
    </div>
  );
};

export default Footer;
