import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { toast, ToastContainer } from "react-toastify";
import { Search } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/LandingPage/Footer";

const ViewSessions = () => {
  const { url, token } = useContext(StoreContext);
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
      if (now < start) updatedStatuses[session._id] = "not_started";
      else if (now >= start && now <= end)
        updatedStatuses[session._id] = "active";
      else updatedStatuses[session._id] = "ended";
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
          await axios.put(
            `${url}/api/v1/session/update-status/${session._id}`,
            {
              status: "completed",
              paymentStatus: "success",
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
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
            const trainerRes = await axios.get(
              `${url}/api/v1/trainer/${session.trainerId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const trainer = trainerRes.data.trainer;
            return {
              ...session,
              trainerName: `${trainer.firstName || ""} ${
                trainer.lastName || ""
              }`.trim(),
              trainerAvatar: trainer.avatar,
            };
          } catch {
            return {
              ...session,
              trainerName: "Not available",
              trainerAvatar: null,
            };
          }
        })
      );

      setSessions(sessionsWithTrainer);
      markCompletedSessions(sessionsWithTrainer);
    } catch (error) {
      console.error("Error in fetching sessions", error);
    }
  };

  const handleCancel = async (session) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this session?"
    );
    if (!confirmed) return;
    try {
      await axios.post(
        `${url}/api/v1/session/cancel`,
        { sessionId: session._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
  className="relative bg-gray-50 border border-gray-300 rounded-2xl shadow-md overflow-hidden transition-transform transform hover:scale-[1.02] hover:shadow-lg w-full max-w-xs mx-auto"
>

      <div className="flex justify-center mt-4">
        <img
          src={session.trainerAvatar || "https://www.gravatar.com/avatar/?d=mp"}
          alt="Trainer"
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
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

      <div className="p-4 space-y-2">
        <h3 className="text-blue-900 text-lg font-bold text-center">{session.type}</h3>
        <p className="text-gray-600 text-sm text-center">Personal training session</p>

        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>📅 Scheduled:</strong> {new Date(session.scheduledAt).toLocaleString()}</p>
          <p><strong>🕒 Duration:</strong> {session.duration} mins</p>
          <p><strong>👤 Trainer:</strong> {session.trainerName}</p>
          <p><strong>💰 Fee:</strong> ₹{session.fee}</p>
        </div>
      </div>

      {session.status === "confirmed" && (
        <div className="flex flex-col sm:flex-row justify-between gap-2 px-4 py-3 border-t bg-gray-100">
          {/* Always show Join Meeting */}
          <a
            href={status === "active" ? session.meetingLink : "#"}
            target={status === "active" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`flex-1 text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              status === "active"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Join Meeting
          </a>

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


  const filtered = sessions.filter(
    (s) =>
      s.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.trainerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcoming = filtered.filter((s) => s.status === "confirmed");
  const past = filtered.filter(
    (s) => s.status === "completed" || s.status === "cancelled"
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 pt-6  overflow-hidden">
      <ToastContainer />

      {/* Decorative bubbles */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-purple-300/40 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-300/30 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-blue-200/50 rounded-full blur-2xl z-0" />

      <div className="px-4 relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">💪 My Sessions</h1>
          <p className="text-gray-600 mt-2">
            View and manage your booked fitness sessions
          </p>
        </div>

        <div className="mb-10 flex justify-center">
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

        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Upcoming / Ongoing Sessions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.length === 0 ? (
            <p className="text-gray-600">No upcoming sessions.</p>
          ) : (
            upcoming.map(renderCard)
          )}
        </div>

        <h2 className="text-lg font-semibold mt-10 mb-4 text-gray-700">
          Completed / Cancelled Sessions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {past.length === 0 ? (
            <p className="text-gray-600">No past sessions.</p>
          ) : (
            past.map(renderCard)
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ViewSessions;
