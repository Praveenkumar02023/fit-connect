import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import {
  Star,
  Mail,
  Calendar,
  IndianRupee,
  X
} from "lucide-react";
import Footer from "../LandingPage/Footer";
import { toast , Toaster} from "react-hot-toast";



const TrainerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);
  const [trainer, setTrainer] = useState(null);
  const [subscription, setSubscription] = useState([]);
  const [showBookingPopup, setShowBookingPopup] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");

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

  const getTotal = () => {
    if (!trainer || !duration) return 0;
    const base = trainer?.pricing_perSession || 0;
    const multiplier = durationMultipliers[duration] || 1;
    return base * multiplier;
  };

  const handleBooking = async () => {
  if (!date || !time || !type || !duration) {
    toast.error("Please fill all session details before proceeding.");
    return;
  }

  const scheduledAt = new Date(`${date} ${time}`);
  const fee = getTotal();

  const payload = {
    type,
    scheduledAt: scheduledAt.toISOString(),
    duration: durationToMinutes[duration] || 30,
    trainerId: trainer._id,
    fee,
  };

  try {
    const res = await axios.post(
      `${url}/api/v1/session/createstripesession`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.success && res.data.sessionurl) {
      window.location.href = res.data.sessionurl;
    } else {
      toast.error("Payment session creation failed.");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong while booking.");
  }
};


  const handleSubscribe = async () => {
  const alreadySubscribed = subscription.some(
  (s) => s.trainerId?.toString() === trainer._id?.toString() && s.isActive
);


  if (alreadySubscribed) {
    toast("You’ve already subscribed to this trainer!", {
      icon: "ℹ️",
    });
    return;
  }

  try {
    const res = await axios.post(
      `${url}/api/v1/subscription/checkout-stripe-session`,
      { trainerId: trainer._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success && res.data.sessionurl) {
      window.location.href = res.data.sessionurl;
    }
  } catch (error) {
    toast.error("Something went wrong during subscription.");
  }
};


  useEffect(() => {
    async function fetchTrainer() {
      const res = await axios.get(`${url}/api/v1/trainer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainer(res.data.trainer);
    }
    fetchTrainer();
  }, []);

  useEffect(() => {
    if (!trainer) return;

    async function getSubscriptions() {
      const res = await axios.get(`${url}/api/v1/subscription/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const currentTrainerSubscriptions = res.data.Allsubscription.filter(
        (s) => s.trainerId === trainer._id
      );
      setSubscription(currentTrainerSubscriptions);
      // console.log(currentTrainerSubscriptions);
    }

    getSubscriptions();
  }, [trainer]);

  if (!trainer) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50 pt-2 md:pt-4">
      <div className="max-w-6xl mx-auto bg-white border border-gray-300 rounded-xl shadow-lg p-6 space-y-6">
        {/* Trainer Info Section */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center justify-center">
            <img
              src={trainer.avatar || "/default-avatar.png"}
              alt="trainer"
              className="w-24 h-24 rounded-full border-2 border-black object-cover"
            />
            <div className="ml-4 flex flex-col">
              <h1 className="text-xl font-bold capitalize">
                {trainer.firstName} {trainer.lastName}
              </h1>
              <p className="text-gray-500">{subscription.length} Subscribers</p>
              <p className="flex items-center gap-1 text-yellow-500 justify-center">
                <Star className="w-4 h-4" /> {trainer.rating || "-"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {trainer.speciality?.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">About Me</h2>
              <p className="text-sm text-gray-700">{trainer.about}</p>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Experience</h2>
              <p className="text-sm text-gray-700">{trainer.experience}</p>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Achievements</h2>
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-700 space-y-1">
                {trainer.Achievements?.split("\\n").map(
                  (a, i) => a.trim() && <li key={i}>{a.trim()}</li>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 flex flex-col h-full justify-between">
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-green-600" /> Pricing
              </h2>
              <div className="mt-2 space-y-3">
                <div className="p-3 rounded bg-green-100 border border-green-300">
                  <p className="text-sm text-gray-700 text-center">Per Session</p>
                  <p className="text-xl font-bold text-center text-green-700">
                    ₹{trainer.pricing_perSession}
                  </p>
                  <button
                    onClick={() => setShowBookingPopup(true)}
                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
                  >
                    Book Session
                  </button>
                </div>

                <div className="p-3 rounded bg-purple-100 border border-purple-300">
                  <p className="text-sm text-gray-700 text-center">Per Month</p>
                  <p className="text-xl font-bold text-center text-purple-700">
                    ₹{trainer.pricing_perMonth}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    Save 25% with monthly plan
                  </p>
                  <button
                    onClick={handleSubscribe}
                    className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md"
                  >
                    Subscribe Monthly
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Contact Info</h2>
              <p className="flex items-center gap-2 text-sm text-blue-600">
                <Mail className="w-4 h-4" /> {trainer.email}
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4" /> Joined{" "}
                {trainer.createdAt?.split("T")[0]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Popup */}
      {showBookingPopup && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative shadow-xl border border-gray-300">
            <button
              onClick={() => setShowBookingPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center">Book a Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <input
                  type="date"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                <select
                  className="border border-gray-300 p-2 rounded-md w-full"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="">Select Time</option>
                  {["06", "07", "08", "09", "10", "11", "12"].map(h => (
                    <option key={h + "AM"} value={`${h}:00 AM`}>{`${h}:00 AM`}</option>
                  ))}
                  {["01", "02", "03", "04", "05", "06", "07", "08"].map(h => (
                    <option key={h + "PM"} value={`${h}:00 PM`}>{`${h}:00 PM`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                <select
                  className="border border-gray-300 p-2 rounded-md w-full"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  {trainer?.speciality?.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  className="border border-gray-300 p-2 rounded-md w-full"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="">Select Duration</option>
                  <option value="30 min">30 min</option>
                  <option value="45 min">45 min</option>
                  <option value="1 hr">1 hr</option>
                </select>
              </div>

              {/* Summary Card */}
              <div className="pt-4 border-t bg-gray-100 rounded-md p-4 space-y-1 text-sm text-gray-700">
                <p><strong>Date:</strong> {date || "Not selected"}</p>
                <p><strong>Time:</strong> {time || "Not selected"}</p>
                <p><strong>Trainer:</strong> {trainer.firstName}</p>
                <p><strong>Session Type:</strong> {type || "Not selected"}</p>
                <p><strong>Duration:</strong> {duration || "Not selected"}</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">Total: ₹{getTotal()}</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => setShowBookingPopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleBooking}
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
     
      <Footer />
    </div>
  );
};

export default TrainerProfile;
