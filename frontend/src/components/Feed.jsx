import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Shell,
  Users,
  MapPin,
  Clock,
  Trophy,
  Dumbbell,
  Star,
  IndianRupee,
} from "lucide-react";

import NavbarLink from "./LandingPage/TextComponent.jsx";
import Button from "./ui/Button.jsx";
import Footer from "./LandingPage/Footer.jsx";
import Navbar from "./User-Dashboard/Navbar.jsx";

const Feed = () => {
  const [user , setUser] = useState(null);
  const [event, setEvent] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {

    async function getEvents() {
      try {
        const res = await axios.get(`${url}/api/v1/event/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) setEvent(res.data.allEvents);
      } catch (error) {
        console.log(error);
      }
    }

    async function getTrainers() {
      try {
        const res = await axios.get(`${url}/api/v1/trainer/`);
        if (res.status === 200) setTrainers(res.data.trainers);
      } catch (error) {
        console.log(error);
      }
    }

    getEvents();
    getTrainers();
  }, []);

  const isToday = (someDate) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  const handleClick = async (event) => {
    try {
      const alreadyRegistered = await axios.post(
        `${url}/api/v1/event/register-check`,
        { eventId: event._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (alreadyRegistered.data.registered) {
        toast.info("You're already registered for this event.");
        return;
      }

      const res = await axios.post(
        `${url}/api/v1/event/checkout-stripe-session`,
        { eventId: event._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success && res.data.sessionurl) {
        window.location.href = res.data.sessionurl;
      } else {
        toast.error("Payment session creation failed.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-neutral-50 via-blue-50 to-blue-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
  <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-pink-300 rounded-full blur-3xl  animate-pulse" />
  <div className="absolute top-[300px] right-[100px] w-96 h-96 bg-violet-300/40 rounded-full blur-3xl opacity-50 animate-pulse" />
  <div className="absolute top-[50%] left-[20%] w-80 h-80 bg-orange-200 rounded-full blur-[120px]  animate-pulse" />
  <div className="absolute bottom-[300px] left-[-60px] w-72 h-72 bg-lime-200/70 rounded-full blur-[100px]  animate-pulse" />
  <div className="absolute bottom-[600px] right-[-60px] w-64 h-64 bg-rose-300/40 rounded-full blur-3xl  animate-pulse" />
  <div className="absolute bottom-[120px] left-[40%] w-96 h-96 bg-indigo-200/40 rounded-full blur-[120px] opacity-10 animate-pulse" />
  <div className="absolute top-[20%] left-[1%] w-96 h-96 bg-emerald-200/90 rounded-full blur-[120px] opacity-30 animate-pulse" />
</div>

      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
          alt="Fitness Hero"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-blue-600 text-4xl md:text-5xl font-bold mb-4 animate-slide-up" 
            style={{ textShadow: "2px 2px 6px rgba(255, 255, 255, 1.8)" }}
            >
              Transform Your Fitness Journey
            </h1>
            <p
              className="text-xl opacity-90 font-semibold animate-slide-up"
              style={{ animationDelay: "0.2s" ,textShadow: "2px 2px 6px rgba(255, 255, 255, 3.8)" }}
            >
              Connect with top trainers and join exciting fitness events
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-16">
        {/* Featured Trainers */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-200/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Featured Trainers
                </h2>
                <p className="text-muted-foreground">
                  Top-rated professionals to guide your journey
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {trainers.slice(0, 4).map((trainer) => (
              <div
                key={trainer._id}
                className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-400/50 flex flex-col bg-gray-50"
              >
                <div className="p-4">
                  <img
                    src={trainer.avatar || "https://i.imgur.com/fmYr5lP.png"}
                    alt="trainer"
                    className="h-48 w-full object-cover rounded-lg"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between space-y-3">
                  <h3 className="mt-[-24px] text-center text-lg text-black font-semibold">
                    {trainer.firstName + " " + trainer.lastName}
                  </h3>

                  {/* Speciality */}
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-1">
                    <Dumbbell size={22} className="mt-0.5 text-blue-500" />
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(trainer.speciality)
                        ? trainer.speciality.map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-neutral-800 text-white px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))
                        : null}
                    </div>
                  </div>

                  {/* Experience & Rating */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Clock size={22} className="text-yellow-600" />
                    <span>{trainer.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span>4.7/5</span>
                  </div>

                  <Button
                    size="sm"
                    className="w-full mt-3 text-white bg-blue-200 hover:bg-blue-200/90 transition-all duration-300"
                    onClick={() => navigate(`/trainers/${trainer._id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Events */}
        {["Upcoming Events", "Ongoing Events"].map((title, idx) => {
          const isOngoing = title === "Ongoing Events";
          const filteredEvents = event.filter((e) => {
            const date = new Date(e.date);
            return isOngoing ? isToday(date) : date > new Date() && !isToday(date);
          });

          return (
            <section key={title} className="animate-slide-up">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${isOngoing ? "bg-yellow-200/10" : "bg-fitness-accent/10"} rounded-lg`}>
                    <Clock className={`h-6 w-6 ${isOngoing ? "text-yellow-500" : "text-fitness-accent"}`} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">{title}</h2>
                    <p className="text-muted-foreground">
                      {isOngoing ? "Events happening today" : "Join exciting fitness competitions"}
                    </p>
                  </div>
                </div>
              </div>


              {/* events */}
              
              <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((e) => (
                  <div
                    key={e._id}
                    className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-400/50 bg-gray-50 flex flex-col justify-center"
                  >
                    <div className="p-4">
                      <img
                        src={e.avatar || "https://i.imgur.com/7s4U6vF.png"}
                        alt="event"
                        className="h-48 w-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-between space-y-3">
                      <h3 className="text-center mt-[-20px] text-xl font-semibold text-foreground">{e.title}</h3>
                      <p className=" text-center text-sm text-muted-foreground mb-3 line-clamp-2">{e.description}</p>

                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin size={16} className="text-blue-500 mt-0.5" />
                        <span>{e.location}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Clock size={16} className="text-yellow-500 mt-0.5" />
                        <span>{new Date(e.date).toLocaleString()}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm font-medium text-fitness-success">
                        <Trophy size={16} className="text-green-600 mt-0.5" />
                        <span>Prize: ₹{e.prizePool}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm font-medium text-muted-foreground">
                        <IndianRupee size={16} className="text-indigo-600 mt-0.5" />
                        <span>Registration Fee: ₹{e.registrationFee}</span>
                      </div>

                      <Button
                        size="sm"
                        className="w-full mt-2 text-white bg-fitness-accent hover:bg-fitness-accent/90 transition-all duration-300"
                        onClick={() => handleClick(e)}
                      >
                        Register
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <Footer />
    </div>
  );
};

export default Feed;
