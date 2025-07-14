import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  CreditCard,
  Trophy,
  User,
  CheckCircle,
} from "lucide-react";

const Dashboard = () => {
  const { token, url } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const [totalSessions, setTotalSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [totalEvents, setTotalEvents] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const userRes = await axios.get(`${url}/api/v1/user/id`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data.user?.name || "User");

      const sessionsRes = await axios.get(`${url}/api/v1/user/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessions = sessionsRes.data.allSessions || [];
      const completed = sessions.filter((s) => s.status === "completed");
      const upcoming = sessions.filter((s) => s.status === "confirmed");

      setTotalSessions(sessions);
      setCompletedSessions(completed);
      setUpcomingSessions(upcoming);

      const eventsRes = await axios.post(
        `${url}/api/v1/event/UserRegisteredEvents`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTotalEvents(eventsRes.data.events || []);

      const subsRes = await axios.get(`${url}/api/v1/subscription/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptions(subsRes.data.subscriptions || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-2xl p-6 mb-10 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user || "User"}!</h1>
          <p className="text-base opacity-90 mt-2">Stay fit. Stay focused.</p>
          <p className="text-sm opacity-80">Ready to crush your fitness goals today?</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-full p-4">
          <User size={32} color="blue" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <StatCard icon={<CalendarDays />} title="Total Sessions" value={totalSessions.length} />
        <StatCard icon={<Clock />} title="Upcoming Sessions" value={upcomingSessions.length} />
        <StatCard icon={<CheckCircle />} title="Completed Sessions" value={completedSessions.length} />
        <StatCard icon={<CreditCard />} title="Subscriptions" value={subscriptions.length} />
        <StatCard icon={<Trophy />} title="Registered Events" value={totalEvents.length} />
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-blue-800 mb-1">Your Fitness Progress</h2>
          <p className="text-sm text-gray-500 mb-4">Track your workout distribution</p>
          <div className="flex justify-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwohcuIsomV4gjrN4Y7xPxw5tQqijutuDwvA&s"
              alt="Fitness Progress"
              className="w-48 h-48 rounded-full border-4 border-blue-200 shadow"
            />
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">*Real chart coming soon</p>
        </div>

        <div className="bg-gradient-to-br from-blue-200 to-blue-100 rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-5">Quick Actions</h2>
          <button
            className="w-full bg-blue-600 text-white text-lg font-semibold py-3 px-4 rounded-lg mb-4 hover:bg-blue-700 transition"
            onClick={() => navigate("/sessions")}
          >
            View All Sessions
          </button>
          <button
            className="w-full bg-white border border-blue-600 text-blue-600 text-lg font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition"
            onClick={() => navigate("/subscription")}
          >
            Buy Subscription
          </button>
        </div>
      </div>

      {/* Upcoming and Completed Sessions Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h3 className="text-lg font-bold text-blue-800 mb-3">Upcoming Sessions</h3>
          {upcomingSessions.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming sessions</p>
          ) : (
            <ul className="space-y-2">
              {upcomingSessions.map((session) => (
                <li key={session._id} className="p-4 bg-blue-50 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-blue-900">{session.type}</p>
                  <p className="text-xs text-gray-600">
                    Scheduled: {new Date(session.scheduledAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h3 className="text-lg font-bold text-green-700 mb-3">Completed Sessions</h3>
          {completedSessions.length === 0 ? (
            <p className="text-gray-500 text-sm">No completed sessions</p>
          ) : (
            <ul className="space-y-2">
              {completedSessions.map((session) => (
                <li key={session._id} className="p-4 bg-green-50 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-green-900">{session.type}</p>
                  <p className="text-xs text-gray-600">
                    Completed: {new Date(session.scheduledAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-md p-6 min-h-[150px] flex flex-col justify-center items-center text-center hover:shadow-xl transition-all duration-300">
    <div className="bg-blue-600 text-white rounded-full p-4 mb-4 shadow-md">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h4 className="text-3xl font-bold text-blue-800">{value}</h4>
    <p className="text-sm font-medium text-blue-700">{title}</p>
  </div>
);

export default Dashboard;
