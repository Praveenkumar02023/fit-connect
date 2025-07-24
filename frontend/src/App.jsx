import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public Components
import Signin from './components/Signin';
import Signup from './components/Signup';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import Policy from './components/Policy';
import Terms from './components/Terms';
import Feed from "./components/Feed";
import Chat from './components/Chat';
import TrainerProfile from './components/User-Dashboard/TrainerProfile';
import MyTrainers from './components/User-Dashboard/MyTrainers';
import UpdateTrainerProfile from './components/Trainer-Dashboard/UpdateTrainerProfile';

// User Pages
import UserLayout from './pages/User/UserLayout';
import Dashboard from './pages/User/Dashboard';
import BookSessions from './pages/User/BookSessions';
import ViewSubscriptions from './pages/User/ViewSubscriptions';
import UpdateProfile from './pages/User/UserProfile';
import Payment from './pages/User/Payment';
import MyEvents from './pages/User/MyEvents';
import BuySubscription from './pages/User/BuySubscription';
import SubscriptionSuccess from './pages/User/SubscriptionSuccess';
import SessionSuccess from './pages/User/SessionSuccess';
import RegisterEvents from './pages/User/RegisterEvents';
import EventSuccess from './pages/User/EventSuccess';
import ViewSessions from './pages/User/ViewSessions';

// Trainer Pages
import TrainerLayout from './pages/Trainer/TrainerLayout';
import TrainerDashboard from './pages/Trainer/TrainerDashboard';
import TrainerSessionsPage from './pages/Trainer/ViewMySessions';
import Subscribers from './pages/Trainer/Subscribers';
import Earnings from './pages/Trainer/Earnings';
import CreateEvent from './pages/Trainer/CreateEvent';
import ViewEvents from './pages/Trainer/ViewEvents';
import EditEventPage from './pages/Trainer/EditEventPage';
import ViewClientProfile from './pages/Trainer/ClientProfile';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup/:role" element={<Signup />} />
          <Route path="/signin/:role" element={<Signin />} />
          <Route path="/signup" element={<Navigate to="/signup/user" />} />
          <Route path="/signin" element={<Navigate to="/signin/user" />} />

          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="trainers/:id" element={<TrainerProfile />} />
            <Route path="chat/:id" element={<Chat />} />
            <Route path="bookSessions" element={<BookSessions />} />
            <Route path="subscriptions" element={<ViewSubscriptions />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="profile" element={<UpdateProfile />} />
            <Route path="payments" element={<Payment />} />
            <Route path="events" element={<MyEvents />} />
            <Route path="MyTrainers" element={<MyTrainers />} />
            <Route path="MySessions" element={<ViewSessions />} />
            <Route path="feed" element={<Feed />} />
            <Route path="buySubscription" element={<BuySubscription />} />
            <Route path="registerEvents" element={<RegisterEvents />} />
          </Route>

          {/* Payment Success Routes */}
          <Route path="/subscription-success" element={<SubscriptionSuccess />} />
          <Route path="/session-success" element={<SessionSuccess />} />
          <Route path="/event-success" element={<EventSuccess />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />

          {/* Trainer Routes with Layout */}
          <Route path="/trainer" element={<TrainerLayout />}>
            <Route index element={<TrainerDashboard />} />
            <Route path="sessions" element={<TrainerSessionsPage />} />
            <Route path="client/:clientId" element={<ViewClientProfile />} />
            <Route path="subscribers" element={<Subscribers />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="createEvent" element={<CreateEvent />} />
            <Route path="events" element={<ViewEvents />} />
            <Route path="event/edit/:eventId" element={<EditEventPage />} />
            <Route path="profile" element={<UpdateTrainerProfile />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
