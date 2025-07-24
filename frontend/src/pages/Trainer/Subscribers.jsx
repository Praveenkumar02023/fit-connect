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
    <div className="relative min-h-screen w-full px-6 py-10 bg-gradient-to-br from-yellow-50 via-purple-50 to-blue-50 overflow-hidden">
      {/* Bubbles */}
      <div className="absolute top-10 left-10 w-36 h-36 bg-purple-400 rounded-full blur-3xl opacity-50 z-0" />
      <div className="absolute top-1/3 right-10 w-48 h-48 bg-pink-400 rounded-full blur-3xl opacity-40 z-0" />
      <div className="absolute bottom-16 left-1/3 w-40 h-40 bg-yellow-400 rounded-full blur-3xl opacity-40 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-semibold text-gray-900 tracking-wide">
            🏋️‍♂️ My Clients
          </h2>
        </div>

        {/* Subscriber Cards */}
        <div className="flex flex-col gap-6 items-center">
          {subscribers.map((sub) => (
            <div
              key={sub._id}
              className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4"
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
              <div className="flex gap-3 flex-wrap justify-center">
                <button
                  onClick={() => navigate(`/trainer/client/${sub.userId}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                >
                  View Profile
                </button>
                <button
                  onClick={() =>
                    navigate(`/user/chat/${sub.userId}`, {
                      state: {
                        who: "User",
                        username: sub.UserName,
                        avatar: sub.UserImage,
                      },
                    })
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="text-center text-sm text-gray-500 mt-16 pb-6 relative z-10">
        © {new Date().getFullYear()} FitConnect. All rights reserved.
      </footer>
    </div>
  );
};

export default Subscribers;
