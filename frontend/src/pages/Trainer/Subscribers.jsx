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
      {/* Heading with custom gradient */}
      <div
  className="mb-6 px-6 py-4 rounded-xl text-center shadow-md"
  style={{
    backgroundImage: "linear-gradient(to right, #0acffe 0%, #495aff 100%)",
  }}
>
  <h2 className="text-3xl font-bold text-white">
    Your Subscribers
  </h2>
</div>
      {/* Count */}
      <p className="text-center text-gray-800 mb-8 text-2xl font-bold">
        Total Subscribers: {subscribers.length}
      </p>

      {/* Subscriber Cards */}
      <div className="flex flex-col gap-6">
        {subscribers.map((sub) => (
          <div
            key={sub._id}
            className="flex justify-between items-center bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] rounded-xl p-4 shadow-md min-h-[120px]"
          >
            {/* Left: Profile */}
            <div className="flex items-center gap-4">
              <img
                src={sub.UserImage}
                className="w-16 h-16 rounded-full border-2 border-white shadow-md"
              />
              <div>
                <p className="text-lg font-semibold text-gray-800">{sub.UserName}</p>
              </div>
            </div>

            {/* Right: Button */}
            <button
              onClick={() => navigate(`/user-profile/${sub.userId}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscribers;
