import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { Search } from "lucide-react";
import Footer from "../../components/LandingPage/Footer";
import LogoLoader from "../../components/LogoLoader";

const TrainerSessionsPage = () => {
  const { token, url } = useContext(StoreContext);
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [meetingStatuses, setMeetingStatuses] = useState({});
  const[loading , setLoading] = useState(true);

  useEffect(() => {
    fetchTrainerSessions();
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

 const fetchTrainerSessions = async () => {
  try {
    const res = await axios.get(`${url}/api/v1/trainer/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const sessionsWithClient = await Promise.all(
      res.data.allSessions.map(async (session) => {
        try {
          const userRes = await axios.get(`${url}/api/v1/user/${session.clientId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const user = userRes.data.user;
          return {
            ...session,
            clientName: user.name,
            clientImage: user.avatar,
          };
        } catch {
          return {
            ...session,
            clientName: "Unknown Client",
            clientImage: null,
          };
        }
      })
    );

    setSessions(sessionsWithClient);
  } catch (error) {
    console.error("Error fetching sessions", error);
  } finally {
    setLoading(false); // ✅ Loader stops after data is set
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
            src={session.clientImage || "https://www.gravatar.com/avatar/?d=mp"}
            alt="Client"
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
          <h3 className="text-blue-900 text-lg font-bold text-center">
            {session.type}
          </h3>
          <p className="text-gray-600 text-sm text-center">Fitness Session</p>

          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <strong>📅 Scheduled:</strong>{" "}
              {new Date(session.scheduledAt).toLocaleString()}
            </p>
            <p>
              <strong>🕒 Duration:</strong> {session.duration} mins
            </p>
            <p>
              <strong>👤 Client:</strong> {session.clientName}
            </p>
            <p>
              <strong>💬 Meeting:</strong>{" "}
              {status === "active" ? "Live Now" : status === "ended" ? "Ended" : "Not started"}
            </p>
          </div>
        </div>

        {session.status === "confirmed" && (
          <div className="flex justify-center px-4 py-3 border-t bg-gray-100">
            <a
              href={status === "active" ? session.meetingLink : "#"}
              target={status === "active" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`w-full text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                status === "active"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Join Meeting
            </a>
          </div>
        )}
      </div>
    );
  };

  const filtered = sessions.filter(
    (s) =>
      s.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcoming = filtered.filter((s) => s.status === "confirmed");
  const past = filtered.filter(
    (s) => s.status === "cancelled" || s.status === "completed"
  );

  if(loading) return <LogoLoader/>

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-white to-blue-100">
      <div className="flex-grow relative pt-6 overflow-hidden">
        {/* Decorative Bubbles */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-purple-500/40 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-500/30 rounded-full blur-3xl z-0" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-blue-500/50 rounded-full blur-2xl z-0" />

        <div className="px-4 relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="pt-8 text-4xl font-bold text-gray-800">Trainer Sessions</h1>
            <p className="text-gray-600 mt-2">
              View and manage your confirmed, completed and cancelled sessions
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-10 flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by client name or session type"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Upcoming */}
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

          {/* Past */}
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
      </div>

      <Footer />
    </div>
  );
};

export default TrainerSessionsPage;
