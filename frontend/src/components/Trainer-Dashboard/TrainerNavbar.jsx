import { Shell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavbarLink from "../LandingPage/TextComponent.jsx";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext.jsx";
import axios from "axios";
import TrainerSidebar from "../Trainer-Dashboard/TrainerSidebar.jsx";

const TrainerNavbar = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trainer, setTrainer] = useState(null);
  const { token, url } = useContext(StoreContext);

  useEffect(() => {
    async function getTrainer() {
      try {
        const res = await axios.get(`${url}/api/v1/trainer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) setTrainer(res.data.trainer);
      } catch (error) {
        console.log(error);
      }
    }
    getTrainer();
  }, [token, url]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", sidebarOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [sidebarOpen]);

  return (
    <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (same as user navbar) */}
          <div
            onClick={() => navigate("/trainer/")}
            className="flex items-center cursor-pointer"
          >
            <div className="p-2 bg-gradient-fitness rounded-xl shadow-fitness">
              <Shell className="h-6 w-6 text-black" /> {/* changed from Dumbbell */}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-black">
              FitConnect
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <NavbarLink text="Dashboard" to="/trainer/" />
            <NavbarLink text="My Sessions" to="/trainer/sessions" />
            <NavbarLink text="Clients" to="/trainer/subscribers" />
          </div>

          {/* Profile + Menu for Mobile */}
          <div className="flex items-center gap-3">
            {/* Desktop Profile */}
            {trainer && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-md font-semibold">{trainer?.firstName}</span>
                <img
                  src={
                    trainer.avatar?.trim()
                      ? trainer.avatar
                      : "https://www.gravatar.com/avatar/?d=mp"
                  }
                  alt="profile"
                  className="w-9 h-9 rounded-full cursor-pointer ring-2 ring-primary hover:scale-105 transition-all"
                  onClick={() => setSidebarOpen(true)}
                />
              </div>
            )}

            {/* Mobile Menu Icon */}
            <button
              className="flex sm:hidden p-2 border rounded-md hover:bg-muted"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <TrainerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        trainer={trainer}
      />
    </div>
  );
};

export default TrainerNavbar;
