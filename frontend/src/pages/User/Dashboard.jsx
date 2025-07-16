import React, { useContext, useEffect, useMemo, useState } from "react";
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
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"]; // Blue, Green, Yellow

const Dashboard = () => {
  const { token, url } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [totalEvents, setTotalEvents] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const userRes = await axios.get(`${url}/api/v1/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data.user);

      const sessionsRes = await axios.get(`${url}/api/v1/user/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(sessionsRes.data.allSessions || []);

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

  const upcomingSessions = useMemo(
    () => sessions.filter((s) => s.status === "confirmed"),
    [sessions]
  );

  const completedSessions = useMemo(
    () => sessions.filter((s) => s.status === "completed"),
    [sessions]
  );

  const pieData = useMemo(() => [
    { name: "Upcoming", value: upcomingSessions.length },
    { name: "Completed", value: completedSessions.length },
    {
      name: "Other",
      value: sessions.length - (upcomingSessions.length + completedSessions.length),
    },
  ], [sessions.length, upcomingSessions.length, completedSessions.length]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-blue-600 font-semibold text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-10">
      {/* Welcome */}
      <div className="bg-blue-600 text-white rounded-xl p-6 mb-8 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user.name}!
          </h1>
          <p className="text-sm opacity-90">
            Ready to crush your fitness goals today?
          </p>
        </div>
        <div className="h-12 w-12 rounded-full">
          <img
            src={user.avatar || "https://www.gravatar.com/avatar/?d=mp"}
            alt="user"
            loading="lazy"
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-8">
        <StatCard icon={<CalendarDays />} title="Total Sessions" value={sessions.length} />
        <StatCard icon={<Clock />} title="Upcoming" value={upcomingSessions.length} />
        <StatCard icon={<CheckCircle />} title="Completed" value={completedSessions.length} />
        <StatCard icon={<CreditCard />} title="Subscriptions" value={subscriptions.length} />
        <StatCard icon={<Trophy />} title="Events" value={totalEvents.length} />
      </div>

      {/* Chart + Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Fitness Progress</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  dataKey="value"
                  isAnimationActive={true}
                  label={({ name, percent, value }) =>
                    value > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ""
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 shadow">
          <h2 className="text-base font-semibold text-blue-800 mb-4">Quick Actions</h2>
          <ActionBtn text="Cancel a Session" onClick={() => navigate("/user/cancelSessions")} />
          <ActionBtn text="Buy Subscription" onClick={() => navigate("/user/buySubscription")} />
          <ActionBtn text="Register for Event" onClick={() => navigate("/user/registerEvents")} />
        </div>
      </div>

      {/* Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SessionList title="Upcoming Sessions" sessions={upcomingSessions} color="blue" />
        <SessionList title="Completed Sessions" sessions={completedSessions} color="green" />
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center shadow hover:shadow-md transition">
    <div className="text-blue-700 mb-2">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h4 className="text-xl font-bold text-blue-900">{value}</h4>
    <p className="text-sm text-blue-800">{title}</p>
  </div>
);

const ActionBtn = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-lg mb-3 hover:bg-blue-100 transition"
  >
    {text}
  </button>
);

const SessionList = ({ title, sessions, color }) => (
  <div className="bg-white rounded-xl p-5 shadow">
    <h3 className={`text-lg font-semibold text-${color}-700 mb-3`}>{title}</h3>
    {sessions.length === 0 ? (
      <p className="text-sm text-gray-500">No {title.toLowerCase()}</p>
    ) : (
      <ul className="space-y-2">
        {sessions.map((s) => (
          <li
            key={s._id}
            className={`p-4 bg-${color}-50 rounded-lg border border-${color}-100`}
          >
            <p className={`text-sm font-semibold text-${color}-900`}>{s.type}</p>
            <p className="text-xs text-gray-600">
              {color === "blue" ? "Scheduled" : "Completed"}:{" "}
              {new Date(s.scheduledAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Dashboard;
