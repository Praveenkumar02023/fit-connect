import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUser,
  FaRegListAlt,
  FaIdBadge,
  FaThLarge,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col justify-between">
      {/* Top section */}
      <div className="p-6">
        {/* Logo and tagline */}
        <div className="text-left mb-4">
          <h1 className="text-blue-500 font-bold text-2xl">FitConnect</h1>
          <p className="text-gray-400 text-sm">Your fitness journey</p>
        </div>

        <hr className="border-gray-700 mb-6" />

        <nav>
          <ul className="space-y-2">
            <Link to="/user">
              <li className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg font-medium cursor-pointer">
                <FaThLarge className="mr-3" /> Dashboard
              </li>
            </Link>

            <Link to="/user/bookSessions">
              <li className="flex items-center px-4 py-2 rounded-lg cursor-pointer text-gray-300 hover:bg-gray-800 hover:text-white transition">
                <FaCalendarAlt className="mr-3" /> Book Session
              </li>
            </Link>

            <Link to="/user/subscriptions">
              <li className="flex items-center px-4 py-2 rounded-lg cursor-pointer text-gray-300 hover:bg-gray-800 hover:text-white transition">
                <FaIdBadge className="mr-3" /> My Subscriptions
              </li>
            </Link>

            <Link to="/user/events">
              <li className="flex items-center px-4 py-2 rounded-lg cursor-pointer text-gray-300 hover:bg-gray-800 hover:text-white transition">
                <FaRegListAlt className="mr-3" /> Events
              </li>
            </Link>

            <Link to="/user/payments">
              <li className="flex items-center px-4 py-2 rounded-lg cursor-pointer text-gray-300 hover:bg-gray-800 hover:text-white transition">
                <FaMoneyBillWave className="mr-3" /> Payments
              </li>
            </Link>

            <Link to="/user/profile">
              <li className="flex items-center px-4 py-2 rounded-lg cursor-pointer text-gray-300 hover:bg-gray-800 hover:text-white transition">
                <FaUser className="mr-3" /> Profile
              </li>
            </Link>
          </ul>
        </nav>
      </div>

      {/* Bottom user info */}
      <div>
        <hr className="border-gray-700 mx-4 mb-3" />
        <div className="bg-gray-800 p-4">
          <div className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-lg" />
            </div>
            <div className="text-sm">
              <p className="text-white font-medium">John Doe</p>
              <p className="text-gray-300">Premium Member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
