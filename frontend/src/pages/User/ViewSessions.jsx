// ViewSessions.jsx

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
  const [meetingStatuses, setMeetingStatuses] = useState({});

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    const interval = setInterval(updateMeetingStatuses, 10000);
    updateMeetingStatuses();
    return () => clearInterval(interval);
  }, [sessions]);

  const updateMeetingStatuses = () => {
    const now = new Date();
    const updatedStatuses = {};
    sessions.forEach((session) => {
      const start = new Date(session.scheduledAt);
      const end = new Date(start.getTime() + session.duration * 60000);
      if (now < start) updatedStatuses[session._id] = 'not_started';
      else if (now >= start && now <= end) updatedStatuses[session._id] = 'active';
      else updatedStatuses[session._id] = 'ended';
    });
    setMeetingStatuses(updatedStatuses);
  };

  const markCompletedSessions = async (sessionList) => {
    const now = new Date();

    for (const session of sessionList) {
      const start = new Date(session.scheduledAt);
      const end = new Date(start.getTime() + session.duration * 60000);

      if (now > end && session.status === "confirmed") {
        try {
          await axios.put(`${url}/api/v1/session/update-status/${session._id}`, {
            status: "completed",
            paymentStatus: "success",
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error("Failed to mark session as completed", error);
        }
      }
    }
  };

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
              trainerName: `${trainer.firstName || ''} ${trainer.lastName || ''}`.trim(),
              trainerAvatar: trainer.avatar,
            };
          } catch {
            return { ...session, trainerName: 'Not available', trainerAvatar: null };
          }
        })
      );

      setSessions(sessionsWithTrainer);
      markCompletedSessions(sessionsWithTrainer); // ✅ mark ended confirmed sessions
    } catch (error) {
      console.error('Error in fetching sessions', error);
    }
  };

  const handleCancel = async (session) => {
    const confirmed = window.confirm("Are you sure you want to cancel this session?");
    if (!confirmed) return;
    try {
      await axios.post(`${url}/api/v1/session/cancel`, { sessionId: session._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Session cancelled successfully.");
      fetchSessions();
    } catch {
      toast.error("Unable to cancel session.");
    }
  };

  const renderCard = (session) => {
    const status = meetingStatuses[session._id];

    return (
      <div
        key={session._id}
        className="bg-white rounded-2xl shadow-md overflow-hidden max-w-md w-full mx-auto relative transition-transform transform hover:scale-105 hover:shadow-xl hover:border-blue-300 border border-gray-200"
      >
        <div className="flex justify-center mt-4">
          <img
            src={session.trainerAvatar || "https://www.gravatar.com/avatar/?d=mp"}
            alt="Trainer"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          />
        </div>

        <div
          className={`absolute top-2 right-2 text-sm px-3 py-1 rounded-full font-semibold ${
            session.status === "completed"
              ? "bg-green-200 text-green-800"
              : session.status === "cancelled"
              ? "bg-red-200 text-red-700"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {session.status}
        </div>

        <div className="p-4 space-y-2 text-center">
          <h3 className="text-blue-900 text-lg font-bold">{session.type}</h3>
          <p className="text-gray-600 text-sm">Personal training session</p>

          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>📅 Scheduled:</strong> {new Date(session.scheduledAt).toLocaleString()}</p>
            <p><strong>🕒 Duration:</strong> {session.duration} mins</p>
            <p><strong>👤 Trainer:</strong> {session.trainerName}</p>
            <p><strong>💰 Fee:</strong> ₹{session.fee}</p>
          </div>
        </div>

        {session.status === "confirmed" && (
          <div className="flex justify-between px-4 py-3 border-t bg-gray-50 gap-2">
            {status === "active" && session.meetingLink && (
              <a
                href={session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Join Meeting
              </a>
            )}

            {status === "not_started" && (
              <p className="flex-1 text-center bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm cursor-not-allowed">
                Meeting not started
              </p>
            )}

            {status === "ended" && (
              <p className="flex-1 text-center bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm cursor-not-allowed">
                Meeting has ended
              </p>
            )}

            <button
              onClick={() => handleCancel(session)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Cancel Session
            </button>
          </div>
        )}
      </div>
    );
  };

  const filtered = sessions.filter((s) =>
    s.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.trainerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcoming = filtered.filter((s) => s.status === 'confirmed');
  const past = filtered.filter((s) => s.status === 'completed' || s.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-blue-600 py-5 px-4 text-center text-white shadow mt-4 rounded-xl ml-3 mr-3 h-20">
        <h1 className="text-3xl font-bold">Your Sessions</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex justify-center">
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

        <h2 className="text-lg font-semibold mb-4">Upcoming / Ongoing Sessions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mr-3 ml-3">
          {upcoming.length === 0 ? (
            <p className="text-gray-600">No upcoming sessions.</p>
          ) : (
            upcoming.map(renderCard)
          )}
        </div>

        <h2 className="text-lg font-semibold mt-10 mb-4">Completed / Cancelled Sessions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mr-3 ml-3">
          {past.length === 0 ? (
            <p className="text-gray-600">No past sessions.</p>
          ) : (
            past.map(renderCard)
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSessions;
