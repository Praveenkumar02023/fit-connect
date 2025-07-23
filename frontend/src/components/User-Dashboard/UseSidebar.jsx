import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  Clock,
  LogOut,
  User,
  Receipt,
} from 'lucide-react';
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/user/' },
  { id: 'trainers', label: 'My Trainers', icon: Users, path: '/user/MyTrainers' },
  { id: 'events', label: 'My Events', icon: Calendar, path: '/user/events' },
  { id: 'sessions', label: 'My Sessions', icon: Clock, path: '/user/MySessions' },
  { id: 'subscriptions', label: 'My Subscriptions', icon: CreditCard , path: '/user/subscriptions' },
  { id: 'payments', label: 'Payments', icon: Receipt, path: '/user/Payments' },
];

const logoutItem = {
  id: 'logout',
  label: 'Logout',
  icon: LogOut,
  path: '/signin',
  isLogout: true
};

const UserSidebar = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const { token, url } = useContext(StoreContext);

  const handleItemClick = (item) => {
    if (item.isLogout) {
      localStorage.clear();
      navigate('/signin/user');
    } else {
      navigate(item.path);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 h-screen bg-black/60 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 rounded-l-3xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col justify-between h-full p-6">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-800">My Account</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Profile */}
            {user && (
              <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <img
                      src={user.avatar?.trim() ? user.avatar : "https://www.gravatar.com/avatar/?d=mp"}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigate('/user/profile');
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 transition"
                >
                  <User size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">View Profile</span>
                </button>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isHovered = hoveredItem === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 transform hover:bg-blue-50 hover:scale-[1.02] ${
                      isHovered ? 'bg-blue-100' : 'bg-white'
                    }`}
                  >
                    <Icon size={20} className={isHovered ? 'text-blue-600' : 'text-gray-500'} />
                    <span className={`font-medium ${isHovered ? 'text-blue-600' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Logout */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => handleItemClick(logoutItem)}
              onMouseEnter={() => setHoveredItem(logoutItem.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition duration-200 transform hover:bg-red-100 hover:scale-[1.02]"
            >
              <LogOut size={20} className="text-red-500" />
              <span className="font-medium text-red-500">{logoutItem.label}</span>
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">© 2025 FitConnect</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
