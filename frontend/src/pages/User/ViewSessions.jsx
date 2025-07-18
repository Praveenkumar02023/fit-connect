import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { toast, ToastContainer } from 'react-toastify';
import {
  CalendarDays,
  BadgeCheck,
  Clock,
  IndianRupee,
  User,
  Search,
} from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const ViewSessions = () => {
  const { url, token } = useContext(StoreContext);
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/session/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      const sessionsWithTrainer = await Promise.all(
        res.data.Allsession.map(async (session) => {
          try {
            const trainerRes = await axios.get(`${url}/api/v1/trainer/${session.trainerId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const trainer = trainerRes.data.trainer;
            return {
              ...session,
              trainerName: `${trainer.firstName} ${trainer.lastName}`,
            };
          } catch (err) {
            console.error('Trainer fetch failed', err);
            return session;
          }
        })
      );

      setSessions(sessionsWithTrainer);
    } catch (error) {
      console.log('Error in fetching sessions', error);
    }
  };

  const handleClick = async (session) => {
    const confirmed = window.confirm("Are you sure you want to cancel this session?");
    if (!confirmed) return;

    try {
      await axios.post(
        `${url}/api/v1/session/cancel`,
        { sessionId: session._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Your session has been cancelled successfully. Refund will be processed soon.');
      fetchSessions(); // Refresh the list
    } catch (error) {
      console.error('Cancel failed', error);
      toast.error('Cannot cancel the session.');
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter((session) => {
    return (
      session.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.trainerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#ffffff]">
      <ToastContainer />

      {/* Header */}
      <div className="bg-blue-600 py-6 px-4 sm:px-10 shadow-md">
        <h1 className="text-3xl font-bold text-white text-center">Sessions You Have Booked</h1>
      </div>

      {/* Search */}
      <div className="px-6 sm:px-12 mt-6 flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by session type or trainer name"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Session Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 sm:px-12 py-10">
        {filteredSessions.length === 0 ? (
          <p className="text-center col-span-full text-gray-600">No sessions found</p>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200"
            >
              {/* Type and Status */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
                  <BadgeCheck className="h-5 w-5 bg-blue-100 p-1 rounded-full" />
                  {session.type}
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full uppercase 
                    ${session.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : session.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {session.status}
                </span>
              </div>

              {/* Trainer */}
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  <strong>Trainer:</strong> {session.trainerName}
                </span>
              </div>

              {/* Duration */}
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  <strong>Duration:</strong> {session.duration} mins
                </span>
              </div>

              {/* Scheduled Date & Time */}
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  <strong>Scheduled at:</strong>{" "}
                    {new Date(session.scheduledAt).toLocaleString()}
                </span>
              </div>

              {/* Fee */}
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  <strong>Paid:</strong> ₹{session.fee}
                </span>
              </div>

              {/* Cancel Button */}
              {session.status === 'confirmed' && (
                <button
                  onClick={() => handleClick(session)}
                  className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2 rounded-xl text-sm font-semibold shadow-md transition-all"
                >
                  Cancel Session
                </button>
              )}
              {/* Join Meeting Button */}
             {/* {session.meetingLink && (
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full block text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-semibold shadow-md transition-all"
                >
                  Join Meeting
                </a>
              )} */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewSessions;