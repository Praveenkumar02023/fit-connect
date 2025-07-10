import { FaBell, FaUser } from 'react-icons/fa';

const Topbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm">
      {/* Search Bar */}
      <input
        className="border px-4 py-2 rounded-md w-1/2"
        placeholder="Search..."
      />

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon with Dot */}
        <div className="relative">
          <FaBell className="text-gray-600 text-xl" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white"></span>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-2">
          {/* Profile Icon */}
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <FaUser className="text-white text-sm" />
          </div>

          {/* User Info */}
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm">John Doe</span>
            <span className="text-gray-500 text-xs">Premium Member</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
