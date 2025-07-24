import React, { useContext, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { CalendarDays, Clock, Dumbbell, Timer } from "lucide-react";

const durationMultipliers = {
  "30 mins": 0.5,
  "45 mins": 0.75,
  "1 hour": 1,
};

const availableTimeSlots = [
  "06:00", "07:00", "08:00", "09:00",
  "10:00", "11:00", "12:00", "14:00",
  "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00",
];

const BookSession = ({ trainer , setShowBookingModal }) => {
  const { url, token } = useContext(StoreContext);

  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    sessionType: "",
    duration: "",
  });

  const getTotal = () => {
    if (!trainer || !bookingData.duration) return 0;
    const base = trainer?.pricing_perSession || 0;
    const multiplier = durationMultipliers[bookingData.duration] || 1;
    return base * multiplier;
  };

  const handleBooking = async () => {
    const { date, time, sessionType, duration } = bookingData;
    if (!date || !time || !sessionType || !duration) {
      alert("Please fill in all fields.");
      return;
    }

    const scheduledAt = new Date(`${date}T${time}`);
    const payload = {
      type: sessionType,
      scheduledAt: scheduledAt.toISOString(),
      duration: durationMultipliers[duration] * 60,
      trainerId: trainer._id,
      fee: getTotal(),
    };

    try {
      const res = await axios.post(
        `${url}/api/v1/session/createstripesession`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.sessionurl) {
        window.location.href = res.data.sessionurl;
      } else {
        alert("Failed to create session");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while booking the session.");
    }
  };

  return (
      <div className="relative bg-gray-50 rounded-xl p-6 shadow-lg w-full h-[420px] ">
      {/* Decorative Bubbles */}
      <button
        className="absolute top-3 right-4 text-2xl font-bold text-gray-600 hover:text-black z-10"
        onClick={() => setShowBookingModal(false)}
      >
        &times;
      </button>
      {/* 🔹 Booking Form Content */}
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          Book a Session with {trainer.firstName} {trainer.lastName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">
              <CalendarDays className="inline-block w-4 h-4 mr-2" />
              Date
            </label>
            <input
              type="date"
              value={bookingData.date}
              onChange={(e) =>
                setBookingData({ ...bookingData, date: e.target.value })
              }
             className="mt-1 block w-full rounded-xl border border-gray-300 bg-white/30 backdrop-blur-md px-4 py-2 text-gray-800 dark:text-white shadow-md transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"


            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">
              <Clock className="inline-block w-4 h-4 mr-2" />
              Time
            </label>
            <select
              value={bookingData.time}
              onChange={(e) =>
                setBookingData({ ...bookingData, time: e.target.value })
              }
              className="mt-1 block w-full rounded-xl border border-gray-300 bg-white/30 backdrop-blur-md px-4 py-2 text-gray-800 dark:text-white shadow-md transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"

            >
              <option value="">Select Time</option>
    {["06", "07", "08", "09", "10", "11", "12"].map((h) => (
      <option key={`${h}AM`} value={`${h}:00 AM`}>
        {`${h}:00 AM`}
      </option>
    ))}
    {["01", "02", "03", "04", "05", "06", "07", "08"].map((h) => (
      <option key={`${h}PM`} value={`${h}:00 PM`}>
        {`${h}:00 PM`}
      </option>
    ))}
  </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
              <Timer className="inline-block w-4 h-4 mr-2" />
              Duration
            </label>
            <select
              value={bookingData.duration}
              onChange={(e) =>
                setBookingData({ ...bookingData, duration: e.target.value })
              }
             className="mt-1 block w-full rounded-xl border border-gray-300 bg-white/30 backdrop-blur-md px-4 py-2 text-gray-800 dark:text-white shadow-md transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"

            >
              <option value="">Select Duration</option>
              {Object.keys(durationMultipliers).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Session Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
              <Dumbbell className="inline-block w-4 h-4 mr-2" />
              Session Type
            </label>
            <select
              value={bookingData.sessionType}
              onChange={(e) =>
                setBookingData({ ...bookingData, sessionType: e.target.value })
              }
              className="mt-1 block w-full rounded-xl border border-gray-300 bg-white/30 backdrop-blur-md px-4 py-2 text-gray-800 dark:text-white shadow-md transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"

            >
              <option value="">Select Type</option>
              {trainer?.speciality?.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Total */}
        <div className="mt-8 text-lg font-semibold text-black text-center ">
          Total: ₹{getTotal()}
        </div>

        <button
          onClick={handleBooking}
          className="mt-6 block mx-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BookSession;
