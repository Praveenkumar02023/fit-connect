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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">My Subscribed Trainers</h2>

      {trainers.length === 0 ? (
        <p className="text-center text-gray-500">You haven't subscribed to any trainers yet.</p>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {trainers.map((trainer) => (
            <div
              key={trainer._id}
              className="flex items-center justify-between p-4 bg-white shadow-md border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={trainer.avatar || "/default-avatar.png"}
                  alt={trainer.firstName}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  <h3 className="text-lg font-semibold">{trainer.firstName} {trainer.lastName}</h3>
                  <p className="text-sm text-gray-600">{trainer.speciality?.join(', ') || 'Fitness Trainer'}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/trainers/${trainer._id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  View Profile
                </button>
                <button
                  onClick={() => navigate(`/chat/${trainer._id}`,{
                    state : {
                      who : "trainer"
                    }
                  })}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrainers;
