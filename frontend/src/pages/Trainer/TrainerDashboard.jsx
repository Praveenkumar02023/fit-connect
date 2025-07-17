import React from 'react'
import {useState , useEffect , useContext} from 'react';
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { useTrainerEarnings } from '../../hooks/useTrainerEarnings';
import { Calendar, CreditCard, User  , Trophy} from 'lucide-react';
import CalendarCard from '../../components/Trainer-Dashboard/CalenderCard';
import CalendarModal from '../../components/Trainer-Dashboard/CalenderModel';


const TrainerDashboard = () => {
  const [subs, setTotalSubs] = useState(0);
  const [upcomingSessions, setUpcomingSessions] = useState(0);
  const [events, setEvents] = useState(0);
  const [sessionDates, setSessionDates] = useState([]);
  const [trainer , setTrainer] = useState(null);
   const { earnings, loading } = useTrainerEarnings();
   const [showCalendar, setShowCalendar] = useState(false);
  
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const fetchTrainerData = async () => {
    try {
      // Subscriptions count
      const subsRes = await axios.get(`${url}/api/v1/subscription/trainer`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTotalSubs(subsRes.data.Allsubscription.length);

      // Sessions
      const sessionRes = await axios.get(`${url}/api/v1/trainer/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const confirmedSessions = sessionRes.data.allSessions.filter(
        (s) => s.status === 'confirmed'
      );

      setUpcomingSessions(confirmedSessions.length);

      const allDates = sessionRes.data.allSessions.map(
        (s) => s.scheduledAt
      );
      setSessionDates(allDates);

      // Events
      const eventRes = await axios.get(`${url}/api/v1/event/trainer`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(eventRes.data.events.length);

      //Trainer Profile
      const trainerRes = await axios.get(`${url}/api/v1/trainer/profile` ,{
         headers: { Authorization: `Bearer ${token}` },
      })
      setTrainer(trainerRes.data.trainer);
     } catch (error) {
      console.error("Error fetching trainer dashboard data:", error);
    }
  };
  if (!trainer) {
  return <div className="text-center py-10 text-gray-600 text-lg">Loading your dashboard...</div>;
}

  return (
   <div className="min-h-screen bg-gray-100 py-10 px-1 sm:px-6">
      {/* Welcome */}
      <div className="bg-blue-600 text-white rounded-xl p-6 mb-8 shadow-md flex justify-between items-center h-[120px]">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Coach {trainer.firstName}!</h1>
          <p className="text-sm opacity-90">Ready to crush your fitness goals today?</p>
        </div>
        <div className="h-12 w-12 rounded-full">
          <img
            src={trainer.avatar || "https://www.gravatar.com/avatar/?d=mp"}
            alt="trainer"
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<User />} title="Total Subscribers" value={subs} description="Active members." />
        <StatCard icon={<CreditCard />} title="Total earnings" value = {`₹${earnings.total}`} description="Your Earnings" />
        <StatCard icon={<Calendar />} title="Upcoming Sessions" value={upcomingSessions} description="This month" />
        <StatCard icon={<Trophy />} title="Events Created" value={events} description="Group challenge events." />
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 max-w-7xl mx-auto">
  <ActionCard
    title="Update Your Profile"
    description="Keep your trainer profile up to date so members know your expertise, availability, and certifications."
    buttonText="Update"
    icon={<User size={26} className="text-green-600 ml-2" />}
    onClick={() => navigate("/trainer/profile")}
  />
  <ActionCard
    title="Create a New Event"
    description="Engage your subscribers by hosting events like challenges, bootcamps, or group workouts."
    buttonText="Create Event"
    icon={<Calendar size={26} className="text-purple-600 ml-2" />}
    onClick={() => navigate("/trainer/event")}
  />
</div>
<div className="space-y-6">
      <CalendarCard onClick={() => setShowCalendar(true)} />
      <CalendarModal isOpen={showCalendar} onClose={() => setShowCalendar(false)} sessionDates={sessionDates} />
    </div>
      

      
    </div>
  )
}
const StatCard = ({ icon, title, value, description }) => (
  <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition flex flex-col items-start">
    <div className="flex items-center justify-between w-full mb-2">
      <h4 className="text-lg font-bold text-blue-900">{title}</h4>
      <div className="text-blue-800 bg-blue-100 p-2 rounded-full">{icon}</div>
    </div>
    <h2 className="text-2xl font-bold text-blue-900 mb-1 items-center text-center">{value}</h2>
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

export default TrainerDashboard