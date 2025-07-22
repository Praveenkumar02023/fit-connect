import { Shell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavbarLink from "../LandingPage/TextComponent.jsx";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext.jsx";
import axios from "axios";
import clsx from "clsx";

import UserSidebar from "../User-Dashboard/UseSidebar.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { token, url } = useContext(StoreContext);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await axios.get(`${url}/api/v1/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, [token, url]);

  useEffect(() => {
  if (sidebarOpen) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }

  return () => {
    document.body.classList.remove('overflow-hidden'); // cleanup on unmount
  };
}, [sidebarOpen]);

  return (
    <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => {
              navigate("/user/feed");
            }}
            className="ml-[-8rem] flex items-center cursor-pointer "
          >
            <div className="p-2 bg-gradient-fitness rounded-xl shadow-fitness">
              <Shell className="h-6 w-6 text-black" />
            </div>
            <h1 className=" ml-[-4px] text-2xl font-bold text-black ">
              FitConnect
            </h1>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavbarLink text=" Events " to="/user/registerEvents" />
            <NavbarLink text=" Trainers " to="/user/buySubscription" />
            <NavbarLink text=" About Us " to="/about" />
          </div>

          {/* Profile Avatar */}
          <div className=" mr-[-8rem] flex items-center space-x-4">
            <h1 className="text-lg font-semibold">
              {user?.name?.trim() ? user.name : ""}
            </h1>
            <img
              src={
                user?.avatar?.trim()
                  ? user.avatar
                  : "https://www.gravatar.com/avatar/?d=mp"
              }
              alt="profile"
              className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-primary hover:scale-105 transition-all"
              onClick={() => setSidebarOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <UserSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Navbar;
