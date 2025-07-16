import { Shell } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUser,
  FaRegListAlt,
  FaIdBadge,
  FaThLarge,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";

const TrainerSidebar = () => {
  const { url, token } = useContext(StoreContext);
  const [trainer, setTrainer] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function getTrainer(url, token, setTrainer) {
      try {
        const res = await axios.get(`${url}/api/v1/trainer/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status !== 200) return;

        setTrainer(res.data.trainer);
      } catch (error) {
        console.log(error);
      }
    }

    getTrainer(url, token, setTrainer);
  }, []);

  const navItems = [
    { to: "/trainer", label: "Dashboard", icon: <FaThLarge /> },
    { to: "/trainer/sessions", label: "My Sessions", icon: <FaCalendarAlt /> },
    { to: "/trainer/create-event", label: "Create Event", icon: <FaCalendarAlt /> },
    { to: "/trainer/subscribers", label: "Subscribers", icon: <FaUser /> },
    { to: "/trainer/events", label: "My Events", icon: <FaRegListAlt /> },
    { to: "/trainer/earnings", label: "Earnings", icon: <FaMoneyBillWave /> }
  ];

  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col justify-between">
      {/* Top section */}
      <div className="p-6">
        <div className="mb-4 flex justify-center items-center text-blue-600 font-bold text-2xl">
          <Shell />
          <h1 className="ml-1">FitConnect</h1>
        </div>

        <hr className="border-gray-700 mb-6" />

        <nav>
          <ul className="space-y-2">
            {navItems.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/trainer"}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg font-medium cursor-pointer transition ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <span className="mr-3">{icon}</span>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom trainer info */}
      <div>
        <hr className="border-gray-700 mx-4 mb-3" />
        <div className="bg-gray-800 p-4">
          <div
            onClick={() => {
              navigate("/trainer/profile");
            }}
            className="hover:scale-105 transition-transform flex items-center space-x-3 bg-gray-700 p-3 rounded-lg cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
              {trainer?.avatar ? (
                <img src={trainer.avatar} alt="trainer avatar" />
              ) : (
                <FaUser className="text-white text-lg" />
              )}
            </div>
            <div className="text-sm">
              <p className="text-white font-medium text-lg">
                {trainer ? trainer.firstName + " "  + trainer.lastName : "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerSidebar;
