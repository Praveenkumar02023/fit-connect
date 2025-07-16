import React, { useContext, useEffect, useMemo, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CreditCard,
  Trophy,
  CheckCircle,
  UserPlus,
  Ban,
  Wallet,
  Activity
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

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

  const pieData = useMemo(
    () => [
      { name: "Upcoming", value: upcomingSessions.length },
      { name: "Completed", value: completedSessions.length },
      {
        name: "Other",
        value: sessions.length - (upcomingSessions.length + completedSessions.length),
      },
    ],
    [sessions.length, upcomingSessions.length, completedSessions.length]
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-blue-600 font-semibold text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-1 sm:px-6">
      {/* Welcome */}
      <div className="bg-blue-600 text-white rounded-xl p-6 mb-8 shadow-md flex justify-between items-center h-[120px]">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-sm opacity-90">Ready to crush your fitness goals today?</p>
        </div>
        <div className="h-12 w-12 rounded-full">
          <img
            src={user.avatar || "https://www.gravatar.com/avatar/?d=mp"}
            alt="user"
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<Clock />} title="Upcoming Sessions" value={upcomingSessions.length} description="Future Sessions." />
        <StatCard icon={<CheckCircle />} title="Completed Sessions" value={completedSessions.length} description="Sessions you've completed." />
        <StatCard icon={<CreditCard />} title="Subscriptions" value={subscriptions.length} description="Your active subscriptions." />
        <StatCard icon={<Trophy />} title="Events Joined" value={totalEvents.length} description="Group challenge events." />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 max-w-7xl mx-auto">
        <ActionCard
          title="Buy Subscription"
          description="Subscribe to your favorite trainer and access exclusive training plans for a full month. Boost your routine today!"
          buttonText="Buy Now"
          icon={<Wallet size={26} className="text-blue-600 ml-2" />}
          onClick={() => navigate("/user/buySubscription")}
        />
        <ActionCard
          title="Cancel a Session"
          description="Need to reschedule? Cancel your upcoming sessions with just a click. Flexible and easy."
          buttonText="Cancel Session"
          icon={<Ban size={26} className="text-red-500 ml-2" />}
          onClick={() => navigate("/user/cancelSessions")}
        />
      </div>
     <div className="mb-10 max-w-7xl mx-auto">
  <ActionCard
    title="Register for Events"
    description={`Show your skills, compete with the best, and win amazing prizes.
Don’t miss out on upcoming fitness challenges and events!
Be bold, step up, and let your performance speak for itself.`}
    buttonText="Register Now"
    icon={<UserPlus size={26} className="text-yellow-500 ml-2" />}
    onClick={() => navigate("/user/registerEvents")}
    fullHeight
  />
</div>



      {/* Chart */}
      <div className="bg-white rounded-xl p-6 shadow mb-10 max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-blue-800 mb-4">Track Your Fitness Progress</h2>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={350} height={350}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={125}
                labelLine={false}
                dataKey="value"
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

      {/* Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        <SessionList title="Upcoming Sessions" sessions={upcomingSessions} color="blue" />
        <SessionList title="Completed Sessions" sessions={completedSessions} color="green" />
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, description }) => (
  <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition flex flex-col items-start">
    <div className="flex items-center justify-between w-full mb-2">
      <h4 className="text-lg font-bold text-blue-900">{title}</h4>
      <div className="text-blue-800 bg-blue-100 p-2 rounded-full">{icon}</div>
    </div>
    <h2 className="text-2xl font-bold text-blue-900 mb-1">{value}</h2>
    <p className="text-sm text-gray-600 leading-snug">{description}</p>
  </div>
);

const ActionCard = ({ title, description, buttonText, onClick, icon, fullHeight }) => (
  <div className={`bg-white border border-blue-200 rounded-xl shadow hover:shadow-md transition w-full flex flex-col justify-between p-6 ${fullHeight ? 'min-h-[220px]' : 'min-h-[220px]'}`}>
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-lg font-bold text-blue-900">{title}</h4>
      {icon}
    </div>
    <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-1">{description}</p>
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition"
    >
      {buttonText}
    </button>
  </div>
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
            className={`p-4 bg-${color}-50 rounded-xl border-l-4 border-${color}-600 shadow-sm`}
          >
            <p className={`text-sm font-semibold text-${color}-800`}>{s.type}</p>
            <p className="text-xs text-gray-600">
              {color === "blue" ? "Scheduled" : "Completed"}: {new Date(s.scheduledAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Dashboard;
