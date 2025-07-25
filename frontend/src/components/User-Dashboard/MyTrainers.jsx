import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const MyTrainers = () => {
  const { token, url } = useContext(StoreContext);
  const [trainers, setTrainers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscribedTrainers();
  }, []);

  const fetchSubscribedTrainers = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/subscription/my-trainers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setTrainers(res.data.trainers);
      }
    } catch (err) {
      console.error("Failed to fetch subscribed trainers:", err);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen overflow-hidden">
      {/* Decorative Bubbles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full opacity-30 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400 rounded-full opacity-30 blur-3xl animate-pulse z-0" />
      <div className="absolute top-[20%] right-[30%] w-24 h-24 bg-pink-300 rounded-full opacity-20 blur-2xl animate-pulse z-0" />
      <div className="absolute bottom-[30%] left-[20%] w-20 h-20 bg-indigo-300 rounded-full opacity-20 blur-2xl animate-pulse z-0" />
      <div className="absolute top-[40%] left-[50%] w-28 h-28 bg-green-200 rounded-full opacity-20 blur-2xl animate-pulse z-0" />

      <div className="relative z-10 p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My Subscribed Trainers</h2>

        {trainers.length === 0 ? (
          <p className="text-center text-gray-500">You haven't subscribed to any trainers yet.</p>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {trainers.map((trainer, index) => {
  if (!trainer) return null; // safely skip null entries

  return (
    <div
      key={trainer._id || index}
      className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 border-gray-400 shadow-md border rounded-lg"
    >
      <div className="flex items-center space-x-4">
        <img
          src={
            trainer.avatar ||
            "https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg?nii=t"
          }
          alt={trainer.firstName}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <h3 className="text-lg font-semibold">
            {trainer.firstName} {trainer.lastName}
          </h3>
          <p className="text-sm text-gray-600">
            {trainer.speciality?.join(", ") || "Fitness Trainer"}
          </p>
        </div>
      </div>

      <div className="mt-3 sm:mt-0 flex space-x-3 justify-center sm:justify-end w-full sm:w-auto">
        <button
          onClick={() => navigate(`/user/trainers/${trainer._id}`)}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          View Profile
        </button>
        <button
          onClick={() =>
            navigate(`/user/chat/${trainer._id}`, {
              state: {
                who: "trainer",
                username: `${trainer.firstName} ${trainer.lastName}`,
                avatar: trainer.avatar,
              },
            })
          }
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Chat
        </button>
      </div>
    </div>
  );
})}

          </div>
        )}

        <footer className="relative text-xs text-gray-400 text-center py-6 z-10 mt-8">
          © 2025 FitConnect. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default MyTrainers;
