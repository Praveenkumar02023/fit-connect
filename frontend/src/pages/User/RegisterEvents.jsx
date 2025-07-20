import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  CalendarDays,
  MapPin,
  Trophy,
  Wallet,
  FileText,
  BadgeCheck,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const RegisterEvents = () => {
  const { url, token } = useContext(StoreContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/event/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data.allEvents);
      } catch (error) {
        console.log("Error in fetching the events");
      }
    };

    fetchEvents();
  }, [url]);

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
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#ffffff] py-0">
      <ToastContainer />

      {/* Header */}
      <div className="bg-blue-600 py-6 px-4 sm:px-10 shadow-md">
        <h1 className="text-3xl font-bold text-white text-center">
          🏆 Register for Upcoming Events
        </h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 sm:px-12 py-10 place-items-center">
        {events.map((event) => (
          <div
            key={event._id}
            className="w-72 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col items-center p-4"
          >
            {/* Image */}
            <img
              src={
                event.avatar ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZcnsKC3iF9pB8_po80WXkn7h_3fd2bNx-Rq9T6B_mCx3IDZsdPjG8qNYt0pPC_YhJEA&usqp=CAU"
              }
              alt={event.title}
              className="border-neutral-600 border w-48 h-48 object-cover rounded-xl mb-4"
            />

            {/* Title */}
            <div className="flex items-center gap-2 text-blue-700 font-semibold text-md mb-2">
              <BadgeCheck className="h-5 w-5 bg-blue-100 p-1 rounded-full" />
              {event.title}
            </div>

            {/* Description */}
            {event.description && (
              <div className="flex items-center text-gray-600 text-sm mb-2 text-center">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                <span>{event.description}</span>
              </div>
            )}

            {/* Info */}
            <div className="text-gray-600 text-sm space-y-2 w-full">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>
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
                  <strong>Prize Pool:</strong> ₹{event.prizePool || 0}
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
              onClick={() => handleClick(event)}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2 rounded-xl text-sm font-semibold shadow-sm transition-all"
            >
              Register Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisterEvents;
