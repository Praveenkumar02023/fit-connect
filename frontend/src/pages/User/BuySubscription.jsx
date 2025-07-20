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
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 sm:px-12 py-10">
  {trainers.map((trainer) => (
    <div
      key={trainer._id}
      className="max-w-sm w-80 mx-auto border border-gray-300 p-4 rounded shadow hover:shadow-lg transition flex flex-col justify-between items-center space-y-3"
    >
      {/* Avatar */}
      <div className="w-full flex justify-center">
        <img
          src={
            trainer.avatar ||
            "https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg?nii=t"
          }
          alt={`${trainer.firstName || "Trainer"} ${trainer.lastName || ""}`}
          className="h-28 w-28 rounded-full object-cover bg-gray-100"
        />
      </div>

      {/* Name */}
      <h3 className="font-semibold text-blue-600 text-lg text-center">
        {trainer.firstName && trainer.lastName
          ? `${trainer.firstName} ${trainer.lastName}`
          : "Not available"}
      </h3>

      {/* Specialities */}
      <p className="text-gray-700 text-sm text-center">
        {Array.isArray(trainer.speciality) && trainer.speciality.length > 0
          ? trainer.speciality.join(", ")
          : trainer.speciality || "Not available"}
      </p>

      {/* Experience */}
      <p className="text-sm text-gray-600 text-center">
        💼 {trainer.experience ? `${trainer.experience} yrs` : "Not available"}
      </p>

      {/* Duration */}
      <p className="text-sm text-gray-600 text-center">📆 Duration: 1 Month</p>

      {/* Price */}
      <p className="text-blue-600 font-semibold text-md text-center">
        ₹{trainer.pricing_perMonth ?? "Not available"}
      </p>

      {/* Subscribe Button */}
      <button
        onClick={() => handleSubscribe(trainer)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold shadow transition-all"
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
