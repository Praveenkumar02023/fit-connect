import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CreditCard,
  User,
  Trophy,
  MessageCircle,
  Square,
} from "lucide-react";
import CalendarCard from "../../components/Trainer-Dashboard/CalenderCard";
import CalendarModal from "../../components/Trainer-Dashboard/CalenderModel";
import Footer from "../../components/LandingPage/Footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const TrainerDashboard = () => {
  const [subs, setSubs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [upcomingSessionsCount, setUpcomingSessionsCount] = useState(0);
  const [sessionDates, setSessionDates] = useState([]);
  const [trainer, setTrainer] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [todaySession, setTodaySession] = useState([]); // was null

  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainerData();
  }, []);

  useEffect(() => {
    calculateMonthlyIncome();
  }, [sessions, events, subs]);

  const fetchTrainerData = async () => {
    try {
      const [subsRes, sessionRes, eventRes, trainerRes] = await Promise.all([
        axios.get(`${url}/api/v1/subscription/trainer`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${url}/api/v1/trainer/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${url}/api/v1/event/trainer`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${url}/api/v1/trainer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const allSessions = sessionRes.data.allSessions || [];
      const confirmed = allSessions.filter((s) => s.status === "confirmed");

      setSubs(subsRes.data.Allsubscription || []);
      setSessions(allSessions);
      setEvents(eventRes.data.events || []);
      setTrainer(trainerRes.data.trainer || {});
      setUpcomingSessionsCount(confirmed.length);
      setSessionDates(
        confirmed.map(
          (s) => new Date(s.scheduledAt).toISOString().split("T")[0]
        )
      );

      // Today's session
     const today = new Date().toDateString();
const sessionsToday = confirmed.filter((s) => {
  const scheduled = new Date(s.scheduledAt).toDateString();
  return scheduled === today;
});

// Fetch client details for each session
const enrichedSessions = await Promise.all(
  sessionsToday.map(async (session) => {
    try {
      const res = await axios.get(`${url}/api/v1/user/${session.clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        ...session,
        client: res.data.user || null,
      };
    } catch (err) {
      console.error("Error fetching client info:", err);
      return {
        ...session,
        client: null,
      };
    }
  })
);

setTodaySession(enrichedSessions);

  console.log(sessionsToday);
  
    } catch (err) {
      console.error("Error fetching trainer dashboard data:", err);
    }
  };

  const calculateMonthlyIncome = () => {
    const map = {};
    const addToMonth = (dateStr, amount, type) => {
      const date = new Date(dateStr);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      if (!map[key]) {
        map[key] = {
          month: key,
          Sessions: 0,
          Subscriptions: 0,
          Events: 0,
        };
      }
      map[key][type] += amount;
    };

    sessions.forEach((s) => {
      if (s.status === "confirmed" && s.fee) {
        addToMonth(s.createdAt, s.fee, "Sessions");
      }
    });

    events.forEach((e) => {
      if (e.registrationFee) {
        addToMonth(e.createdAt, e.registrationFee, "Events");
      }
    });

    subs.forEach((s) => {
      if (s.amount && s.createdAt) {
        addToMonth(s.createdAt, s.amount, "Subscriptions");
      }
    });

    const sorted = Object.values(map).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
    setMonthlyIncome(sorted);
  };

  const getDailySubscriberData = (subs) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const dailyMap = {};

    subs.forEach((s) => {
      const date = new Date(s.createdAt);
      if (
        date.getFullYear() === currentYear &&
        date.getMonth() === currentMonth
      ) {
        const day = String(date.getDate()).padStart(2, "0");
        const key = `${day}/${currentMonth + 1}`;
        if (!dailyMap[key]) {
          dailyMap[key] = { day: key, count: 0 };
        }
        dailyMap[key].count += 1;
      }
    });

    return Object.values(dailyMap).sort(
      (a, b) => Number(a.day.split("/")[0]) - Number(b.day.split("/")[0])
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
      {/* Decorative Bubbles */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-purple-300 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-pink-400 rounded-full blur-2xl opacity-40 z-0" />
      <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-blue-300 rounded-full blur-2xl opacity-30 z-0" />
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-300 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute top-24 right-1/4 w-36 h-36 bg-rose-300 rounded-full blur-2xl opacity-30 z-0" />

      {/* Main Content */}
      <main className="relative z-10 flex-1 pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="text-center text-black p-6 mb-8">
          <h1 className="text-2xl font-bold">
            Welcome back, Coach {trainer?.firstName || "Loading..."}!
          </h1>
          <p className="text-sm opacity-90">
            Ready to inspire your clients today?
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={<User />} title="Subscribers" value={subs.length} />
          <StatCard
            icon={<CreditCard />}
            title="Upcoming Sessions"
            value={upcomingSessionsCount}
          />
          <StatCard
            icon={<Calendar />}
            title="Events Created"
            value={events.length}
          />
          <StatCard
            icon={<Trophy />}
            title="Total Income"
            value={`₹${monthlyIncome.reduce(
              (acc, curr) =>
                acc + curr.Sessions + curr.Subscriptions + curr.Events,
              0
            )}`}
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <ActionCard
            title="Update Profile"
            description="Keep your profile updated to attract more clients."
            onClick={() => navigate("/trainer/profile")}
          />
          <ActionCard
            title="Create Event"
            description="Host new events to engage your community."
            onClick={() => navigate("/trainer/createEvent")}
          />
          <ActionCard
            title="Chat with Clients"
            description="Connect and communicate with your clients."
            onClick={() => navigate("/trainer/chat")}
          />
          <ActionCard
            title="Manage Events"
            description="Edit or cancel your scheduled events here."
            onClick={() => navigate("/trainer/myEvents")}
          />
        </div>

        {/* Calendar + Today’s Session */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Calendar Card */}
          <div className="bg-white border border-gray-300 rounded-xl shadow p-8 ">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              This Month's Calendar
            </h3>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={sessionDates.map((date) => ({
                start: date,
                allDay: true,
                display: "background", // <-- this enables background marking
                className: "custom-blue-bg", // <-- this applies your background color
              }))}
              height={320}
              headerToolbar={{
                left: "",
                center: "title",
                right: "",
              }}
              titleFormat={{ year: "numeric", month: "long" }}
            />

            <div className="flex justify-center mt-4 font-semibold items-center text-sm" >
              {<Square  className="h-4 text-[#7ceed0] fill-[#7ceed0]"/>} Upcoming Sessions
            </div>

          </div>

          {/* Today's Session Card */}
          <div className="bg-white border border-gray-300 rounded-xl shadow p-4">
  <h3 className="text-lg font-semibold text-blue-900 mb-4">
    Today's Sessions
  </h3>

  {todaySession && todaySession.length > 0 ? (
    <div className="space-y-4">
      {todaySession.map((session) => (
        <div
          key={session._id}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200 p-4 rounded-md bg-gray-50"
        >
          <div className="flex items-center gap-4">
            <img
              src={
                session.client?.avatar ||
                "https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg?nii=t"
              }
              alt="Client"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">
                Client: {session.client?.name || "Client"}
              </p>
              <p className="text-sm text-gray-600">
                Time:{" "}
                {new Date(session.scheduledAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                | Duration: {session.duration || 60} mins
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/trainer/sessions`)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-semibold"
          >
            View Session
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No session today.</p>
  )}
</div>

        </div>

        {/* Bar Chart */}
        {monthlyIncome.length > 0 && (
          <div className="bg-gray-50 border border-gray-300 p-6 rounded-xl shadow w-full mb-6">
            <h2 className="text-lg font-semibold mb-4 text-blue-900">
              Monthly Income Overview
            </h2>
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyIncome}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(val) => `₹${val}`} />
                  <Legend />
                  <Bar
                    dataKey="Sessions"
                    fill="#3B82F6"
                    name="Sessions Income"
                  />
                  <Bar
                    dataKey="Subscriptions"
                    fill="#10B981"
                    name="Subscriptions Income"
                  />
                  <Bar dataKey="Events" fill="#F59E0B" name="Events Income" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Line Chart */}
        {subs.length > 0 && (
          <div className="bg-gray-50 border border-gray-300 p-6 rounded-xl shadow w-full">
            <h2 className="text-lg font-semibold mb-4 text-blue-900">
              New Subscribers (This Month)
            </h2>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getDailySubscriberData(subs)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(val) => `${val} subscribers`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="New Subscribers"
                    stroke="#6366F1"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>

      <CalendarModal
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        sessionDates={sessionDates}
      />

      <Footer />
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 shadow flex flex-col justify-between">
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      <div className="p-2 rounded-full bg-blue-100 text-blue-600">{icon}</div>
    </div>
    <h2 className="text-3xl font-bold text-blue-800">{value}</h2>
  </div>
);

const ActionCard = ({ title, description, onClick }) => (
  <div className="bg-gray-50 border border-gray-300 rounded-xl shadow p-5 flex flex-col justify-between min-h-[180px] hover:shadow-md transition">
    <div className="flex items-center justify-center mb-3">
      <h4 className="text-lg font-bold text-blue-900">{title}</h4>
    </div>
    <p className="text-sm text-gray-600 text-center">{description}</p>
    <button
      onClick={onClick}
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm"
    >
      {title}
    </button>
  </div>
);

export default TrainerDashboard;
