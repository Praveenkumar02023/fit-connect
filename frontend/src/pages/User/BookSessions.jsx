import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';

const BookSessions = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [trainer, setTrainer] = useState("");

  const trainerRates = {
    "John Doe - Yoga": 300,
    "Emily Smith - Zumba": 350,
    "Arjun Singh - Strength": 400,
    "Sara Khan - Cardio": 320,
    "David Lee - CrossFit": 450,
  };

  const durationMultipliers = {
    "30 min": 1,
    "45 min": 1.25,
    "1 hr": 1.5,
  };

  const getTotal = () => {
    if (!trainer || !duration) return 0;
    const base = trainerRates[trainer] || 0;
    const multiplier = durationMultipliers[duration] || 1;
    return base * multiplier;
  };

  const total = getTotal();

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-extrabold text-blue-600">FitConnect</div>
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-6 text-gray-600 text-base font-medium">
              <Link to="/user" className="hover:text-blue-500">Dashboard</Link>
              <Link to="/events" className="hover:text-blue-500">Events</Link>
              <Link to="/feed" className="hover:text-blue-500">Feed</Link>
            </nav>
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold"><FaUser></FaUser></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Book a Session</h2>
        <p className="text-center text-gray-600 text-lg mb-10">
          Schedule your workout by selecting your preferences below.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8 w-full">
            {/* Date & Time */}
            <div className="bg-white rounded-lg p-6 shadow w-full">
              <div className="flex items-center mb-4 space-x-2">
                <FaCalendarAlt className="text-blue-500" />
                <h3 className="text-xl font-semibold">Select Date & Time</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="border border-gray-300 p-3 rounded-md w-full"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <select
                    className="border border-gray-300 p-3 rounded-md w-full"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    <option value="">Select time</option>
                    {["06", "07", "08", "09", "10", "11", "12"].map((h) => (
                      <option key={h + "AM"} value={`${h}:00 AM`}>{`${h}:00 AM`}</option>
                    ))}
                    {["01", "02", "03", "04", "05", "06", "07", "08"].map((h) => (
                      <option key={h + "PM"} value={`${h}:00 PM`}>{`${h}:00 PM`}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="bg-white rounded-lg p-6 shadow w-full">
              <div className="flex items-center mb-4 space-x-2">
                <FaClock className="text-blue-500" />
                <h3 className="text-xl font-semibold">Session Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                  <select
                    className="border border-gray-300 p-3 rounded-md w-full"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">Choose Session Type</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Zumba">Zumba</option>
                    <option value="Crossfit">CrossFit</option>
                    <option value="Boxing">Boxing</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Pilates">Pilates</option>
                    <option value="Strength Training">Strength Training</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    className="border border-gray-300 p-3 rounded-md w-full"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="">Select Duration</option>
                    <option value="30 min">30 min</option>
                    <option value="45 min">45 min</option>
                    <option value="1 hr">1 hr</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Trainer */}
            <div className="bg-white rounded-lg p-6 shadow w-full">
              <div className="flex items-center mb-4 space-x-2">
                <FaUser className="text-blue-500" />
                <h3 className="text-xl font-semibold">Trainer</h3>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select your Trainer</label>
              <select
                className="border border-gray-300 p-3 rounded-md w-full"
                value={trainer}
                onChange={(e) => setTrainer(e.target.value)}
              >
                <option value="">Choose Trainer</option>
                <option value="John Doe - Yoga">John Doe - Yoga</option>
                <option value="Emily Smith - Zumba">Emily Smith - Zumba</option>
                <option value="Arjun Singh - Strength">Arjun Singh - Strength</option>
                <option value="Sara Khan - Cardio">Sara Khan - Cardio</option>
                <option value="David Lee - CrossFit">David Lee - CrossFit</option>
              </select>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="w-full">
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <h2 className="text-lg font-semibold text-blue-700 mb-4">Booking Summary</h2>
              <div className="space-y-2 text-gray-800 text-base">
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{date || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time:</span>
                  <span>{time || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Session:</span>
                  <span>{type || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>{duration || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Trainer:</span>
                  <span>{trainer || "Not selected"}</span>
                </div>
              </div>
              <hr />
              <div className="text-xl font-bold text-blue-600">
                Total: ${total}
              </div>
              <button
                className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-blue-300"
                disabled={!date || !time || !type || !duration || !trainer}
              >
                Confirm Booking
              </button>
              <p className="text-sm text-gray-500 text-center">
                You can cancel or reschedule up to 24 hours before your session.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookSessions;
