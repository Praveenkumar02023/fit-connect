import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Subscribers = () => {
  const { token, url } = useContext(StoreContext);
  const [subscribers, setSubscribers] = useState([]);
  const navigate = useNavigate();

  const fetchTrainerSubscriptions = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/subscription/trainer`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const SubsWithTrainer = await Promise.all(
        res.data.Allsubscription.map(async (sub) => {
          try {
            const UserRes = await axios.get(`${url}/api/v1/user/${sub.userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const user = UserRes.data.user;
            return {
              ...sub,
              UserName: user.name,
              UserImage: user.avatar || "/default-profile.png",
              userId: user._id,
            };
          } catch (err) {
            console.error("User fetch failed", err);
            return sub;
          }
        })
      );

      const ActiveSubscriptions = SubsWithTrainer.filter((sub) => sub.isActive === true);
      setSubscribers(ActiveSubscriptions);
    } catch (err) {
      console.error("Subscription fetch failed", err);
    }
  };

  useEffect(() => {
    fetchTrainerSubscriptions();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-10">
      {/* 🌟 Fancy Blue Heading */}
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-blue-700 drop-shadow-md tracking-wide">
          Your Subscribers
        </h2>
        <div className="w-20 h-1 bg-blue-500 mx-auto mt-2 rounded-full shadow" />
      </div>

      {/* Subscriber Count */}
      <p className="text-center text-gray-800 mb-8 text-2xl font-bold">
        Total Subscribers: {subscribers.length}
      </p>

      {/* Subscriber Cards */}
      <div className="flex flex-col gap-6 items-center">
        {subscribers.map((sub) => (
          <div
            key={sub._id}
            className="w-[90%] md:w-[70%] bg-white rounded-xl shadow-lg border border-gray-200 flex justify-between items-center px-6 py-4"
          >
            {/* Left: Profile */}
            <div className="flex items-center gap-4">
              <img
                src={sub.UserImage}
                alt="User"
                className="w-16 h-16 rounded-full border-2 border-white shadow"
              />
              <div>
                <p className="text-lg font-semibold text-gray-800">{sub.UserName}</p>
                <p className="text-sm text-gray-500">Active Subscriber</p>
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/user-profile/${sub.userId}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View Profile
              </button>
              <button
                onClick={() =>
                  navigate(`/chat/${sub.userId}`, {
                    state: {
                      who: "User",
                    },
                  })
                }
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscribers;
