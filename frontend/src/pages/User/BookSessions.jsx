import React, { useEffect, useState, useContext } from 'react';
import { FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const BookSessions = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [trainer, setTrainer] = useState("");
  const [trainers, setTrainers] = useState([]);

  const { url, token } = useContext(StoreContext);

  const durationMultipliers = {
    "30 min": 1,
    "45 min": 1.25,
    "1 hr": 1.5,
  };

  const durationToMinutes = {
    "30 min": 30,
    "45 min": 45,
    "1 hr": 60,
  };

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/trainer/`);
        setTrainers(res.data.trainers || []);
      } catch (err) {
        console.error("Failed to load trainers", err);
      }
    };
    fetchTrainers();
  }, []);

 
  const filteredTrainers = type
    ? trainers.filter(t => t.speciality?.includes(type))
    : trainers;

  
  useEffect(() => {
    const selectedTrainer = trainers.find(t => t._id === trainer);
    if (selectedTrainer && !selectedTrainer.speciality.includes(type)) {
      setTrainer("");
      alert("Selected trainer does not offer this session type.");
    }
  }, [type, trainer, trainers]);

  const getTotal = () => {
    if (!trainer || !duration) return 0;
    const selectedTrainer = trainers.find(t => t._id === trainer);
    const base = selectedTrainer?.pricing_perSession || 0;
    const multiplier = durationMultipliers[duration] || 1;
    return base * multiplier;
  };

  const handleBooking = async () => {
    const scheduledAt = new Date(`${date} ${time}`);
    const fee = getTotal();

    const payload = {
      type,
      scheduledAt: scheduledAt.toISOString(), 
      duration: durationToMinutes[duration] || 30,
      trainerId: trainer,
      fee,
    };
    console.log("Payload:", payload);

     try {
    const res = await axios.post(`${url}/api/v1/session/createstripesession`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success && res.data.sessionurl) {
      window.location.href = res.data.sessionurl; 
    } else {

      alert("Payment session creation failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
};

  const total = getTotal();

  return (
    <div className="bg-gray-50 px-6 pt-8 pb-10 overflow-auto" style={{ height: '100vh' }}>
      <main>
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Book a Session</h2>
        <p className="text-center text-gray-600 text-lg mb-10">
          Schedule your workout by selecting your preferences below.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1.8fr] gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Date & Time */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex items-center mb-4 space-x-2">
                <FaCalendarAlt className="text-blue-500" />
                <h3 className="text-xl font-semibold">Select Date & Time</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {["06", "07", "08", "09", "10", "11", "12"].map(h => (
                      <option key={h + "AM"} value={`${h}:00 AM`}>{`${h}:00 AM`}</option>
                    ))}
                    {["01", "02", "03", "04", "05", "06", "07", "08"].map(h => (
                      <option key={h + "PM"} value={`${h}:00 PM`}>{`${h}:00 PM`}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex items-center mb-4 space-x-2">
                <FaClock className="text-blue-500" />
                <h3 className="text-xl font-semibold">Session Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="bg-white rounded-lg p-6 shadow">
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
                {filteredTrainers.length === 0 ? (
                  <option disabled>No trainer available</option>
                ) : (
                  filteredTrainers.map(t => (
                    <option key={t._id} value={t._id}>
                      {t.firstName} {t.lastName} - {t.speciality?.join(", ")}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="bg-white p-6 rounded-lg shadow h-fit">
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
                <span>{trainers.find(t => t._id === trainer)?.firstName || "Not selected"}</span>
              </div>
            </div>
            <hr className="my-4" />
            <div className="text-xl font-bold text-blue-600">
              Total: ₹{total}
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-blue-300"
              disabled={!date || !time || !type || !duration || !trainer}
              onClick={handleBooking}
            >
              Confirm Booking
            </button>
            <p className="text-sm text-gray-500 text-center mt-2">
              You can cancel or reschedule up to 24 hours before your session.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookSessions;
