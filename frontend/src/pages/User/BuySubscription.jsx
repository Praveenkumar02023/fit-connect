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
  }, []);

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
    <div className="min-h-screen bg-[#f9fafb] py-0">
      {/* Header Bar */}
      <div className="bg-blue-600 py-6 px-4 sm:px-10 shadow">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Choose Your Trainer</h1>
      </div>

      {/* Trainer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-10 py-10">
        {trainers.map((trainer) => (
          <div
            key={trainer._id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-blue-100"
          >
            <div className="flex items-center mb-2 text-blue-800 font-semibold">
              <UserCircle className="w-5 h-5 mr-2" />
              <span className="text-lg">{trainer.firstName}</span>
              <span className="text-lg">&nbsp;</span>
              <span className="text-lg">{trainer.lastName}</span>
            </div>

            <div className="flex items-center text-gray-700 text-sm mb-1">
              <BadgePercent className="w-4 h-4 mr-2" />
              Specialties:{" "}
              <span className="ml-1 text-gray-600 font-medium">
                {Array.isArray(trainer.speciality)
                  ? trainer.speciality.join(", ")
                  : trainer.speciality}
              </span>
            </div>

            <div className="flex items-center text-gray-700 text-sm mb-1">
              <Clock3 className="w-4 h-4 mr-2" />
              Experience:{" "}
              <span className="ml-1 font-medium text-gray-600">
                {trainer.experience || 1} yrs
              </span>
            </div>

            <div className="flex items-center text-gray-700 text-sm mb-1">
              <CalendarCheck2 className="w-4 h-4 mr-2" />
              Duration: <span className="ml-1 font-medium text-gray-600">1 Month</span>
            </div>

            <div className="flex items-center text-blue-700 text-md font-bold mt-3">
              <BadgeIndianRupee className="w-4 h-4 mr-1" />
              ₹{trainer.pricing_perMonth}
            </div>

            <button
              onClick={() => handleSubscribe(trainer)}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition font-medium"
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
