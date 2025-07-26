import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  CalendarDays,
  MapPin,
  Trophy,
  Wallet,
  BadgeCheck,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/LandingPage/Footer";
import LogoLoader from "../../components/LogoLoader";

const RegisterEvents = () => {
  const { url, token } = useContext(StoreContext);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 NEW
  const [loading , setLoading] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/event/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if(res.status != 200){
          return;
        }
        setEvents(res.data.allEvents);
        setLoading(false);
      } catch (error) {
        console.log("Error in fetching the events");
      }
    };

    fetchEvents();
  }, [url]);

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleConfirmRegister = async () => {
    try {
      const alreadyRegistered = await axios.post(
        `${url}/api/v1/event/register-check`,
        { eventId: selectedEvent._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (alreadyRegistered.data.registered) {
        toast.info("You're already registered for this event.");
        closeModal();
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
    }
  };

  // 🔍 Filter logic
  const filteredEvents = events.filter((event) =>
    `${event.title} ${event.location}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if(loading) return <LogoLoader/>

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-orange-50 pt-6 space-y-25">
      <ToastContainer />

      {/* Bubble Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-[200px] right-[300px] w-96 h-96 bg-violet-300 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-[50%] left-[20%] w-80 h-80 bg-orange-200 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[300px] left-[-60px] w-72 h-72 bg-lime-200 rounded-full blur-[100px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[120px] left-[40%] w-96 h-96 bg-indigo-200 rounded-full blur-[120px] opacity-30 animate-pulse" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mt-[-5rem]">
          <h1 className="text-3xl sm:text-3xl font-bold text-black">
            Register for Upcoming Events
          </h1>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base">
            Compete, train, and win exciting rewards!
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="mt-10 mb-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Event Cards */}
        <div className="pt-[3rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col justify-between h-[430px]"
            >
              {/* Image */}
              <img
                src={event.avatar || "https://i.imgur.com/7s4U6vF.png"}
                alt={event.title}
                className="h-36 w-full object-cover rounded-lg"
              />

              {/* Title */}
              <h3 className="text-blue-700 font-semibold text-lg mt-3 flex items-center gap-2">
                <BadgeCheck size={18} />
                {event.title}
              </h3>

              {/* Description */}
              {event.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {event.description}
                </p>
              )}

              {/* Info Section */}
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="truncate">
                    <strong>Location:</strong> {event.location}
                  </span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    <strong>Date:</strong>{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    <strong>Prize:</strong> ₹{event.prizePool || 0}
                  </span>
                </div>
                <div className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    <strong>Fee:</strong> ₹{event.registrationFee || 0}
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => openModal(event)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-all"
              >
                Register Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">
              Confirm Registration
            </h2>

            <img
              src={selectedEvent.avatar || "https://i.imgur.com/7s4U6vF.png"}
              alt="event"
              className="h-44 w-full object-cover rounded-lg mb-4"
            />

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Title:</strong> {selectedEvent.title}
              </p>
              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedEvent.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Prize Pool:</strong> ₹{selectedEvent.prizePool}
              </p>
              <p>
                <strong>Fee:</strong> ₹{selectedEvent.registrationFee}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="w-full px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRegister}
                className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RegisterEvents;
