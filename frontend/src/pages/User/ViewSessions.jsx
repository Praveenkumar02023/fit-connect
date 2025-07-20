import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { toast, ToastContainer } from 'react-toastify';
import { Search } from 'lucide-react';
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
              trainerName: `${trainer.firstName || ''} ${trainer.lastName || ''}`.trim() || 'Not available',
              trainerAvatar: trainer.avatar || null,
            };
          } catch (err) {
            return {
              ...session,
              trainerName: 'Not available',
              trainerAvatar: null,
            };
          }
        })
      );

      setSessions(sessionsWithTrainer);
    } catch (error) {
      console.error('Error in fetching sessions', error);
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
      fetchSessions();
    } catch (error) {
      toast.error('Cannot cancel the session.');
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter((session) =>
    session.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.trainerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingSessions = filteredSessions.filter(
    (s) => s.status === 'confirmed'
  );

  const pastSessions = filteredSessions.filter(
    (s) => s.status === 'completed' || s.status === 'cancelled'
  );

  const renderCard = (session) => (
    <div
      key={session._id}
      className="max-w-sm w-80 mx-auto bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 flex flex-col items-center space-y-4"
    >
      <img
        src={
          session.trainerAvatar ||
          "https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg?nii=t"
        }
        alt={session.trainerName || "Trainer"}
        className="h-24 w-24 rounded-full object-cover bg-gray-100"
      />
      <h3 className="text-lg font-semibold text-blue-700 text-center">
        {session.trainerName || "Not available"}
      </h3>
      <p className="text-sm text-gray-600 text-center">
        🏋️‍♂️ {session.type || "Not available"}
      </p>
      <p className="text-sm text-gray-600 text-center">
        ⏱ Duration: {session.duration || "Not available"} mins
      </p>
      <p className="text-sm text-gray-600 text-center">
        📅 {new Date(session.scheduledAt).toLocaleString()}
      </p>
      <p className="text-blue-600 font-bold text-md text-center">
        ₹{session.fee ?? "Not available"}
      </p>
      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${
          session.status === "completed"
            ? "bg-green-100 text-green-700"
            : session.status === "cancelled"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {session.status}
      </span>

      {session.meetingLink && (
        <a
          href={session.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center mt-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-semibold shadow transition-all"
        >
          Join Meeting
        </a>
      )}
      {session.status === 'confirmed' && (
        <button
          onClick={() => handleClick(session)}
          className="w-full bg-gradient-to-r mt-[-12px] from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-2 rounded-xl text-sm font-semibold shadow transition-all"
        >
          Cancel Session
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#ffffff]">
      <ToastContainer />
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 py-8 px-4 sm:px-10 shadow-md rounded-b-xl">
  <div className="text-center">
    <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
      🎯 My Sessions
    </h1>
    <p className="text-sm sm:text-base text-blue-100 mt-2">
      Manage all your upcoming, ongoing, and past training sessions here
    </p>
  </div>
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

      {/* Upcoming Section */}
      <section className="px-6 sm:px-12 py-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Upcoming / Ongoing Sessions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-8">
          {upcomingSessions.length === 0 ? (
            <p className="text-center col-span-full text-gray-600">No upcoming sessions</p>
          ) : (
            upcomingSessions.map(renderCard)
          )}
        </div>
      </section>

      {/* Past Section */}
      <section className="px-6 sm:px-12 pb-16">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Completed / Cancelled Sessions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastSessions.length === 0 ? (
            <p className="text-center col-span-full text-gray-600">No past sessions</p>
          ) : (
            pastSessions.map(renderCard)
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewSessions;
