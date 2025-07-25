// your imports remain unchanged
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MapPin,
  Clock,
  Trophy,
  Dumbbell,
  Star,
  IndianRupee,
} from "lucide-react";

import Button from "./ui/Button.jsx";
import Footer from "./LandingPage/Footer.jsx";

import { toast } from "react-hot-toast";


const Feed = () => {
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const { url, token } = useContext(StoreContext);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();

  const handleRegisterConfirm = async () => {
  try {
    const alreadyRegistered = await axios.post(
      `${url}/api/v1/event/register-check`,
      { eventId: selectedEvent._id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (alreadyRegistered.data.registered) {
      setShowConfirmModal(false);
      toast.success("You're already registered for this event.");
      return;
    }

    const res = await axios.post(
      `${url}/api/v1/event/checkout-stripe-session`,
      { eventId: selectedEvent._id },
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
  } finally {
    setShowConfirmModal(false);
  }
};

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



  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-neutral-50 via-blue-50 to-blue-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-pink-300 rounded-full blur-3xl  animate-pulse" />
        <div className="absolute top-[200px] right-[300px] w-96 h-96 bg-violet-300/70 rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-[50%] left-[20%] w-80 h-80 bg-orange-200 rounded-full blur-[120px]  animate-pulse" />
        <div className="absolute bottom-[300px] left-[-60px] w-72 h-72 bg-lime-200/70 rounded-full blur-[100px]  animate-pulse" />
        <div className="absolute bottom-[600px] right-[-60px] w-64 h-64 bg-rose-300/40 rounded-full blur-3xl  animate-pulse" />
        <div className="absolute bottom-[120px] left-[40%] w-96 h-96 bg-indigo-200/40 rounded-full blur-[120px] opacity-10 animate-pulse" />
        <div className="absolute top-[20%] left-[1%] w-96 h-96 bg-emerald-200/90 rounded-full blur-[120px] opacity-30 animate-pulse" />
      </div>

      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
          alt="Fitness Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center text-center text-white px-4">
            <div className="w-auto bg-blue-500 px-2 flex items-center">
              <h1
                className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 animate-slide-up"
                style={{ textShadow: "2px 2px 6px rgba(295, 295, 295, 0.2)" }}
              >
                Transform Your Fitness Journey
              </h1>
            </div>
            <div className="mt-1 w-fit px-1 bg-black">
              <p
                className="text-base sm:text-lg md:text-xl font-semibold animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                Connect with top trainers and join exciting fitness events
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Featured Trainers */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-200/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="relative text-2xl sm:text-3xl font-bold text-foreground">
                  Featured Trainers
                </h2>
                <p className="relative text-muted-foreground">
                  Top-rated professionals to guide your journey
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {trainers.slice(0, 4).map((trainer) => (
              <div
                key={trainer._id}
                className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-400/50 flex flex-col bg-gray-50 p-3 sm:p-4"
              >
                <img
                  src={trainer.avatar || "https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg?nii=t"}
                  alt="trainer"
                  className="h-40 sm:h-48 w-full object-cover rounded-lg"
                />
                <div className="pt-3 flex flex-col justify-between space-y-2 sm:space-y-3">
                  <h3 className="text-center text-base sm:text-lg text-black font-semibold">
                    {trainer.firstName + " " + trainer.lastName}
                  </h3>

                  <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground mb-1">
                    <Dumbbell className="text-blue-500 w-4 h-4 flex-shrink-0 mt-[2px]" />

                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(trainer.speciality)
                        ? trainer.speciality.map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-neutral-800 text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs"
                            >
                              {skill}
                            </span>
                          ))
                        : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Clock className="text-yellow-600 w-4 h-4 flex-shrink-0 mt-[2px]" />

                    <span className="line-clamp-2 overflow-hidden">{trainer.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Star
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span>4.7/5</span>
                  </div>

                  <Button
                    size="sm"
                    className="w-full h-9 mt-2 text-white bg-blue-200 hover:bg-blue-200/90 transition-all duration-300"
                    onClick={() => navigate(`/user/trainers/${trainer._id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Events */}
        {["Upcoming Events", "Ongoing Events"].map((title) => {
          const isOngoing = title === "Ongoing Events";
          const filteredEvents = event.filter((e) => {
            const date = new Date(e.date);
            return isOngoing
              ? isToday(date)
              : date > new Date() && !isToday(date);
          });

          return (
            <section key={title} className="relative animate-slide-up">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 ${
                      isOngoing ? "bg-yellow-200/10" : "bg-fitness-accent/10"
                    } rounded-lg`}
                  >
                    <Clock
                      className={`h-6 w-6 ${
                        isOngoing ? "text-yellow-500" : "text-fitness-accent"
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {title}
                    </h2>
                    <p className="text-muted-foreground">
                      {isOngoing
                        ? "Events happening today"
                        : "Join exciting fitness competitions"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((e) => (
                  <div
                    key={e._id}
                    className="relative bg-white h-[430px] rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col justify-between"
                  >
                    <img
                      src={e.avatar || "https://i.imgur.com/7s4U6vF.png"}
                      alt={e.title}
                      className="h-36 w-full object-cover rounded-lg"
                    />
                    <h3 className="text-blue-700 font-semibold text-lg mt-3 text-center">
                      {e.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 text-center">
                      {e.description}
                    </p>

                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="truncate">{e.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{new Date(e.date).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Prize: ₹{e.prizePool}</span>
                      </div>
                      <div className="flex items-center">
                        <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Fee: ₹{e.registrationFee}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full h-9 mt-3 text-white bg-fitness-accent hover:bg-fitness-accent/90 transition-all duration-300"
                      onClick={() => {
                        setSelectedEvent(e);
                        setShowConfirmModal(true);
                      }}
                    >
                      Register
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {showConfirmModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg space-y-4">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setShowConfirmModal(false)}
            >
              ×
            </button>

            {/* Event Image */}
            <img
              src={selectedEvent.avatar || "https://i.imgur.com/7s4U6vF.png"}
              alt={selectedEvent.title}
              className="w-full h-40 object-cover rounded-lg"
            />

            <h2 className="text-xl font-semibold text-center text-blue-700">
              Confirm Registration
            </h2>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Title:</strong> {selectedEvent.title}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedEvent.date).toLocaleString()}
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>
              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>
              <p>
                <strong>Fee:</strong> ₹{selectedEvent.registrationFee}
              </p>
              <p>
                <strong>Prize Pool:</strong> ₹{selectedEvent.prizePool}
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterConfirm}
                className="flex-1 px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Feed;
