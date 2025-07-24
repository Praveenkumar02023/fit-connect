import { Shell, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import NavbarLink from "../LandingPage/TextComponent.jsx";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext.jsx";
import axios from "axios";

import UserSidebar from "../User-Dashboard/UseSidebar.jsx";

const Navbar = ({ place }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { token, url } = useContext(StoreContext);

  const isAuthPage = place === "auth";

  useEffect(() => {
    if (!isAuthPage) {
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
    }
  }, [token, url, isAuthPage]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [sidebarOpen]);

  return (
    <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => navigate(isAuthPage ? "/" : "/user/feed")}
            className="flex items-center cursor-pointer"
          >
            <div className="p-2 bg-gradient-fitness rounded-xl shadow-fitness">
              <Shell className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-black ml-2">
              FitConnect
            </h1>
          </div>

          {/* Links */}
          {isAuthPage ? (
            <div className="flex items-center space-x-6">
              <Link to="/" className="py-1 px-2 hover:bg-gray-200/90 rounded-xl text-sm text-black  font-semibold">
                Home
              </Link>
              <Link to="/signup" className="py-1 px-2 hover:bg-gray-200/90 rounded-xl text-sm text-black   font-semibold">
                Sign Up
              </Link>
              <Link to="/contact" className=" py-1 px-2 hover:bg-gray-200/90 rounded-xl text-sm text-black   font-semibold">
                Contact Us
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Links */}
              <div className="hidden md:flex items-center space-x-6">
                <NavbarLink text="Events" to="/user/registerEvents" />
                <NavbarLink text="Trainers" to="/user/buySubscription" />
                <NavbarLink text="Dashboard" to="/user/" />
              </div>

              {/* Profile + Mobile Menu */}
              <div className="flex items-center gap-3">
                {/* Desktop Profile */}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-md font-semibold capitalize">{user?.name}</span>
                  <img
                    src={
                      user?.avatar?.trim()
                        ? user.avatar
                        : "https://www.gravatar.com/avatar/?d=mp"
                    }
                    alt="profile"
                    className="w-9 h-9 rounded-full cursor-pointer ring-2 ring-primary hover:scale-105 transition-all"
                    onClick={() => setSidebarOpen(true)}
                  />
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="flex sm:hidden p-2 border rounded-md hover:bg-muted"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6 text-black" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sidebar for authenticated users */}
      {!isAuthPage && (
        <UserSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
        />
      )}
    </div>
  );
};

export default Navbar;
