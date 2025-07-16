import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import {
  CalendarDays,
  MapPin,
  Trophy,
  Wallet,
  FileText,
  BadgeCheck,
} from 'lucide-react';

const RegisterEvents = () => {
  const { url, token } = useContext(StoreContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/event/all`,{
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
        alert("Payment session creation failed");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#ffffff] py-0">
      {/* Header Bar */}
      <div className="bg-blue-600 py-6 px-4 sm:px-10 shadow-md">
        <h1 className="text-3xl font-bold text-white text-center">🏆 Register for Upcoming Events</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 sm:px-12 py-10">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200"
          >
            {/* Title */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
                <BadgeCheck className="h-5 w-5 bg-blue-100 p-1 rounded-full" />
                {event.title}
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 uppercase">
                {event.status}
              </span>
            </div>

            {/* Description */}
            {event.description && (
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                <span>{event.description}</span>
              </div>
            )}

            {/* Location */}
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span><strong>Location:</strong> {event.location}</span>
            </div>

            {/* Date */}
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
              <span><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</span>
            </div>

            {/* Prize Pool */}
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <Trophy className="h-4 w-4 mr-2 text-gray-500" />
              <span><strong>Prize Pool:</strong> ₹{event.prizePool || 0}</span>
            </div>

            {/* Registration Fee */}
            <div className="flex items-center text-gray-600 text-sm mb-4">
              <Wallet className="h-4 w-4 mr-2 text-gray-500" />
              <span><strong>Registration Fee:</strong> ₹{event.registrationFee || 0}</span>
            </div>

            {/* Button */}
            <button
              onClick={() => handleClick(event)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2 rounded-xl text-sm font-semibold shadow-sm transition-all"
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
