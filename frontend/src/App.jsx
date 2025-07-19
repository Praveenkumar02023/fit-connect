
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Signin from './components/Signin';
import Signup from './components/Signup';
import Home from './components/Home';
import { Navigate } from 'react-router-dom';


import Dashboard from './pages/User/Dashboard';
import BookSessions from './pages/User/BookSessions';
import UserLayout from './pages/User/UserLayout';
import ViewSubscriptions from './pages/User/ViewSubscriptions';
import UpdateProfile from './pages/User/UserProfile';
import SessionSuccess from './pages/User/SessionSuccess';
import Payment from './pages/User/Payment';
import MyEvents from './pages/User/MyEvents';
import { Toaster } from 'react-hot-toast';
import Feed from "./components/Feed"
import BuySubscription from './pages/User/BuySubscription';
import SubscriptionSuccess from './pages/User/SubscriptionSuccess';
import RegisterEvents from './pages/User/RegisterEvents';
import EventSuccess from './pages/User/EventSuccess';
import ViewSessions from './pages/User/ViewSessions';
import TrainerLayout from './pages/Trainer/TrainerLayout';
import TrainerProfile from './components/User-Dashboard/TrainerProfile';
import TrainerSessionsPage from './pages/Trainer/ViewMySessions';
import Subscribers from './pages/Trainer/Subscribers';
import Earnings from './pages/Trainer/Earnings';
import TrainerDashboard from './pages/Trainer/TrainerDashboard';
import Chat from './components/Chat';
import MyTrainers from './components/User-Dashboard/MyTrainers';
import UpdateTrainerProfile from './components/Trainer-Dashboard/UpdateTrainerProfile';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
       

        {/* User Layout with nested routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Dashboard />} /> 
          <Route path="bookSessions" element={<BookSessions />} />
          <Route path="subscriptions" element={<ViewSubscriptions />} />
          <Route path="profile" element={<UpdateProfile />} />
          <Route path="payments" element={<Payment/>} />
          <Route path = "events" element ={<MyEvents />} />
          <Route path="feed" element={<Feed/>}/>
          <Route path="MyTrainers" element={<MyTrainers/>}/>
        </Route>
          <Route path='/chat/:id' element={<Chat/>}/>
         <Route path="/trainers/:id" element={<TrainerProfile/>}/>
         <Route path="/session-success" element={<SessionSuccess />} />
         <Route path = "/user/buySubscription" element = {<BuySubscription />} />
         <Route path="/subscription-success" element={<SubscriptionSuccess />} />
         <Route path = "/user/registerEvents" element = {<RegisterEvents />} />
         <Route path = "/user/cancelSessions" element = {<ViewSessions />} />
         <Route path="/event-success" element={<EventSuccess />} />
         

        <Route path="/signup/:role" element={<Signup />} />
        <Route path="/signin/:role" element={<Signin />} />

        {/* Redirects to default 'user' role */}
        <Route path="/signup" element={<Navigate to="/signup/user" />} />
        <Route path="/signin" element={<Navigate to="/signin/user" />} />

        <Route path="/trainer" element={<TrainerLayout />}> 
        <Route index element={<TrainerDashboard />} />
        <Route path = "sessions" element = {<TrainerSessionsPage /> } />
        <Route path = "subscribers" element = {<Subscribers /> } />
        <Route path = "earnings" element = {<Earnings />} />
        <Route path='profile' element={<UpdateTrainerProfile/>}/>
        </Route>
        

      </Routes>
    </Router>
    </>

  );
}

export default App;
