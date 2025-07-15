import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  BadgePercent,
  BadgeIndianRupee,
  Clock3,
  CalendarCheck2,
} from "lucide-react";

const BuySubscription = () => {
  const { token, url } = useContext(StoreContext);
  const [trainers, setTrainers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/trainer`);
        setTrainers(res.data.trainers || []);
      } catch (err) {
        console.error("Failed to fetch trainers", err);
      }
    };

    fetchTrainers();
  }, [url]);

  const handleSubscribe = async (trainer) => {
    try {
      const res = await axios.post(
        `${url}/api/v1/subscription/checkout-stripe-session`,
        { trainerId: trainer._id },
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
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#ffffff]">
      {/* Header Bar */}
      <div className="bg-blue-600 py-6 px-4 sm:px-10 shadow-md">
        <h1 className="text-3xl font-bold text-white text-center">Subscribe to a Trainer</h1>
      </div>

      {/* Trainer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 sm:px-12 py-10">
        {trainers.map((trainer) => (
          <div
            key={trainer._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200"
          >
            {/* Name */}
            <div className="flex items-center text-blue-700 font-semibold text-lg mb-3">
              <UserCircle className="h-5 w-5 bg-blue-100 p-1 rounded-full mr-2" />
              <span>
                {trainer.firstName} {trainer.lastName}
              </span>
            </div>

            {/* Specialties */}
            <div className="flex items-center text-gray-700 text-sm mb-2">
              <BadgePercent className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-semibold mr-1">Specialties:</span>
              <span className="font-medium">
                {Array.isArray(trainer.speciality)
                  ? trainer.speciality.join(", ")
                  : trainer.speciality}
              </span>
            </div>

            {/* Experience */}
            <div className="flex items-center text-gray-700 text-sm mb-2">
              <Clock3 className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-semibold mr-1">Experience:</span>
              <span className="font-medium">{trainer.experience || 1} yrs</span>
            </div>

            {/* Duration */}
            <div className="flex items-center text-gray-700 text-sm mb-2">
              <CalendarCheck2 className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-semibold mr-1">Duration:</span>
              <span className="font-medium">1 Month</span>
            </div>

            {/* Pricing */}
            <div className="flex items-center text-blue-700 text-md font-bold mt-3">
              <BadgeIndianRupee className="h-5 w-5 mr-2 text-blue-600" />
              ₹{trainer.pricing_perMonth}
            </div>

            {/* Subscribe Button */}
            <button
              onClick={() => handleSubscribe(trainer)}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2 rounded-xl text-sm font-semibold shadow-sm transition-all"
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuySubscription;
