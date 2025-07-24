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
  MessageCircle,
} from "lucide-react";
// ADD THIS TO THE TOP OF YOUR FILE
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";
import Footer from "../../components/LandingPage/Footer";


const Dashboard = () => {
  const { token, url } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [totalEvents, setTotalEvents] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();

  const [monthlySpendData, setMonthlySpendData] = useState([]);

useEffect(() => {
  const processSpendingData = () => {
    const spendMap = {};

    const addAmount = (dateStr, amount, type) => {
      const date = new Date(dateStr);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!spendMap[key]) {
        spendMap[key] = { month: key, Sessions: 0, Subscriptions: 0, Events: 0 };
      }
      spendMap[key][type] += amount;
    };

    // Sessions
    sessions.forEach((s) => {
      if (s.paymentStatus === "success") {
        addAmount(s.createdAt, s.fee, "Sessions");
      }
    });

    // Subscriptions
    subscriptions.forEach((s) => {
      addAmount(s.createdAt, s.amount, "Subscriptions");
    });

    // Events
    totalEvents.forEach((e) => {
      if (e.registrationFee) {
        addAmount(e.createdAt, e.registrationFee, "Events");
      }
    });

    // Convert to array
    const monthlyData = Object.values(spendMap).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    setMonthlySpendData(monthlyData);
  };

  processSpendingData();
}, [sessions, subscriptions, totalEvents]);


  useEffect(() => {
    async function fetchUserData() {
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
        setSubscriptions(subsRes.data.Allsubscription || []);
        console.log(subsRes.data);
        
      } catch (err) {
        console.error("Dashboard load error:", err.message);
      }
    }

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

  const pieData = useMemo(() => {
    const cancelled = sessions.length - (upcomingSessions.length + completedSessions.length);
    return [
      { name: "Upcoming", value: upcomingSessions.length },
      { name: "Completed", value: completedSessions.length },
      { name: "Cancelled", value: cancelled },
    ];
  }, [sessions, upcomingSessions, completedSessions]);

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-blue-600 text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className=" relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-5 ">
      {/* Blurred bubbles */}
      <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
        {[
          ["top-[5%]", "left-[5%]", "w-60", "h-60", "bg-pink-300", "opacity-50"],
          ["top-[30%]", "right-[10%]", "w-72", "h-72", "bg-purple-400", "opacity-70"],
          ["bottom-[20%]", "left-[30%]", "w-64", "h-64", "bg-blue-300", "opacity-60"],
          ["bottom-[5%]", "right-[5%]", "w-56", "h-56", "bg-yellow-300", "opacity-50"],
          ["top-[60%]", "left-[5%]", "w-72", "h-72", "bg-lime-300", "opacity-60"],
        ].map((styles, i) => (
          <div
            key={i}
            className={`absolute ${styles.join(" ")} rounded-full blur-[100px] animate-pulse z-10`}
          />
        ))}
      </div>

      {/* Welcome */}
      <div className="relative z-20 text-center text-black p-6 mb-10  w-full max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-md mt-1">Ready to crush your fitness goals today?</p>
      </div>

      {/* Stats */}
      <div className="relative z-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-10">
        <StatCard icon={<Clock />} title="Upcoming" value={upcomingSessions.length} description="Future sessions" />
        <StatCard icon={<CheckCircle />} title="Completed" value={completedSessions.length} description="Finished sessions" />
        <StatCard icon={<CreditCard />} title="Subscriptions" value={subscriptions.length} description="Your plans" />
        <StatCard icon={<Trophy />} title="Events Joined" value={totalEvents.length} description="Fitness events" />
      </div>

      {/* Action Cards Row */}
      <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-10">
        <ActionCard
          title="Buy Subscription"
          description="Subscribe to your favorite trainer for exclusive content."
          buttonText="Buy Now"
          icon={<Wallet className="text-blue-600 ml-2" />}
          onClick={() => navigate("/user/buySubscription")}
        />
        <ActionCard
          title="Cancel a Session"
          description="Need flexibility? Cancel or reschedule easily."
          buttonText="Cancel Session"
          icon={<Ban className="text-red-500 ml-2" />}
          onClick={() => navigate("/user/MySessions")}
        />
        <ActionCard
          title="Chat with Trainers"
          description="Message your trainer and stay connected anytime."
          buttonText="Open Chat"
          icon={<MessageCircle className="text-green-600 ml-2" />}
          onClick={() => navigate("/user/myTrainers")}
        />
        <ActionCard
          title="Register for Events"
          description="Show your skills, compete and win exciting prizes."
          buttonText="Register Now"
          icon={<UserPlus className="text-yellow-500 ml-2" />}
          onClick={() => navigate("/user/registerEvents")}
        />
      </div>

      {/* Monthly Spend Bar Chart */}
{monthlySpendData.length > 0 && (
  <div className="relative z-20 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow max-w-7xl mx-auto mb-10">
    <h2 className="text-lg font-bold text-blue-800 mb-4">Monthly Spending Overview</h2>
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlySpendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Sessions" fill="#3B82F6" />
          <Bar dataKey="Subscriptions" fill="#10B981" />
          <Bar dataKey="Events" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)}


      {/* Pie Chart */}
      <div className="relative z-20 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow max-w-7xl mx-auto mb-10">
        <h2 className="text-lg font-bold text-blue-800 mb-4">Track Your Session Progress</h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                labelLine={false}
                dataKey="value"
                label={({ name, value, percent }) =>
                  value > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ""
                }
              >
                {pieData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={
                      entry.name === "Completed"
                        ? "#10B981"
                        : entry.name === "Upcoming"
                        ? "#3B82F6"
                        : "#F59E0B"
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Session Lists */}
      <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto pb-12">
        <SessionList title="Upcoming Sessions" sessions={upcomingSessions} color="blue" />
        <SessionList title="Completed Sessions" sessions={completedSessions} color="green" />
      </div>
      <div className="relative z-10">
        <Footer/>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, description }) => (
  <div className="relative bg-gray-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition">
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-lg font-bold text-blue-900">{title}</h4>
      <div className="bg-blue-100 p-2 rounded-full text-blue-800">{icon}</div>
    </div>
    <h2 className="text-2xl font-bold text-blue-900">{value}</h2>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
  </div>
);

const ActionCard = ({ title, description, buttonText, onClick, icon }) => (
  <div className="relative bg-gray-50 border border-gray-200 rounded-xl shadow p-6">
    <div className="flex justify-between items-center mb-3">
      <h4 className="text-lg font-bold text-blue-900">{title}</h4>
      {icon}
    </div>
    <p className="text-sm text-gray-600 mb-4">{description}</p>
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg"
    >
      {buttonText}
    </button>
  </div>
);

const SessionList = ({ title, sessions, color }) => (
  <div className="relative bg-gray-50 border border-gray-200 rounded-xl p-5 shadow">
    <h3 className={`text-lg font-semibold text-${color}-700 mb-3`}>{title}</h3>
    {sessions.length === 0 ? (
      <p className="text-sm text-gray-500">No {title.toLowerCase()}</p>
    ) : (
      <ul className="space-y-2">
        {sessions.map((s) => (
          <li
            key={s._id}
            className={`p-4 bg-${color}-50 border-l-4 border-${color}-600 rounded-lg`}
          >
            <p className={`text-sm font-semibold text-${color}-800`}>{s.type}</p>
            <p className="text-xs text-gray-600">
              {new Date(s.scheduledAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    )}
    
  </div>
);

export default Dashboard;
