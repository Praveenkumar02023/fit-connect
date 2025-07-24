import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import useTrainerEarnings from '../../hooks/useTrainerEarnings';
import { Calendar, CreditCard, User, Trophy } from 'lucide-react';
import CalendarCard from '../../components/Trainer-Dashboard/CalenderCard';
import CalendarModal from '../../components/Trainer-Dashboard/CalenderModel';
import EarningsChart from '../../components/Trainer-Dashboard/EarningChart';
import Footer from '../../components/LandingPage/Footer';

const TrainerDashboard = () => {
  const [subs, setTotalSubs] = useState(0);
  const [upcomingSessions, setUpcomingSessions] = useState(0);
  const [events, setEvents] = useState(0);
  const [sessionDates, setSessionDates] = useState([]);
  const [trainer, setTrainer] = useState(null);
  const { earnings, monthlyEarnings } = useTrainerEarnings();
  const [showCalendar, setShowCalendar] = useState(false);

  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const fetchTrainerData = async () => {
    try {
      const subsRes = await axios.get(`${url}/api/v1/subscription/trainer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalSubs(subsRes.data.Allsubscription.length);

      const sessionRes = await axios.get(`${url}/api/v1/trainer/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const confirmed = sessionRes.data.allSessions.filter((s) => s.status === 'confirmed');
      setUpcomingSessions(confirmed.length);
      setSessionDates(sessionRes.data.allSessions.map((s) => s.scheduledAt));

      const eventRes = await axios.get(`${url}/api/v1/event/trainer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(eventRes.data.events.length);

      const trainerRes = await axios.get(`${url}/api/v1/trainer/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainer(trainerRes.data.trainer);
    } catch (error) {
      console.error("Error fetching trainer dashboard data:", error);
    }
  };

  if (!trainer) {
    return <div className="text-center py-10 text-gray-600 text-lg">Loading your dashboard...</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
      {/* Decorative Bubbles */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-purple-300 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-pink-400 rounded-full blur-2xl opacity-40 z-0" />
      <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-blue-300 rounded-full blur-2xl opacity-30 z-0" />
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-300 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute top-24 right-1/4 w-36 h-36 bg-rose-300 rounded-full blur-2xl opacity-30 z-0" />

      {/* Main Content */}
      <main className="relative z-10 flex-1 pt-6 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="bg-blue-600 text-white rounded-xl p-6 mb-8 shadow-md flex justify-between items-center h-[120px]">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Coach {trainer.firstName}!</h1>
            <p className="text-sm opacity-90">Ready to crush your fitness goals today?</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={<User />} title="Total Subscribers" value={subs} description="Active members." />
          <StatCard icon={<CreditCard />} title="Total Earnings" value={`₹${earnings.total}`} description="Your earnings" />
          <StatCard icon={<Calendar />} title="Upcoming Sessions" value={upcomingSessions} description="This month" />
          <StatCard icon={<Trophy />} title="Events Created" value={events} description="Group challenge events." />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ActionCard
            title="Update Your Profile"
            description="Keep your trainer profile up to date so members know your expertise and availability."
            buttonText="Update"
            icon={<User size={26} className="text-green-600 ml-2" />}
            onClick={() => navigate("/trainer/profile")}
          />
          <ActionCard
            title="Create a New Event"
            description="Engage your subscribers by hosting challenges or bootcamps."
            buttonText="Create Event"
            icon={<Calendar size={26} className="text-purple-600 ml-2" />}
            onClick={() => navigate("/trainer/createEvent")}
          />
        </div>

        {/* Calendar + Chart */}
        <div className="space-y-6 mb-10">
          <CalendarCard onClick={() => setShowCalendar(true)} />
          <CalendarModal
            isOpen={showCalendar}
            onClose={() => setShowCalendar(false)}
            sessionDates={sessionDates}
          />
          <EarningsChart data={monthlyEarnings} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
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

const ActionCard = ({ title, description, buttonText, onClick, icon }) => (
  <div className="bg-white border border-blue-200 rounded-xl shadow hover:shadow-md transition w-full flex flex-col justify-between p-6 min-h-[220px]">
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

export default TrainerDashboard;
