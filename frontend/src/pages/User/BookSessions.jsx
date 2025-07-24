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
      <div className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-xl p-6 shadow-lg w-full h-[420px] ">
      {/* Decorative Bubbles */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-blue-300 rounded-full opacity-30 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-10 right-10 w-28 h-28 bg-purple-400 rounded-full opacity-30 blur-3xl animate-pulse z-0" />
      <div className="absolute top-[30%] right-[30%] w-16 h-16 bg-pink-300 rounded-full opacity-20 blur-2xl animate-pulse z-0" />
      <div className="absolute bottom-[25%] left-[25%] w-14 h-14 bg-indigo-300 rounded-full opacity-20 blur-2xl animate-pulse z-0" />
      <div className="absolute top-[45%] left-[55%] w-20 h-20 bg-green-200 rounded-full opacity-20 blur-2xl animate-pulse z-0" />
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
              className="mt-1 block w-full border rounded-md p-2"
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
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="">Select Time</option>
              {availableTimeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
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
              className="mt-1 block w-full border rounded-md p-2"
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
              className="mt-1 block w-full border rounded-md p-2"
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
