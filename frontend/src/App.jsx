
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
        </Route>
         <Route path="/session-success" element={<SessionSuccess />} />
        

        <Route path="/signup/:role" element={<Signup />} />
        <Route path="/signin/:role" element={<Signin />} />

        {/* Redirects to default 'user' role */}
        <Route path="/signup" element={<Navigate to="/signup/user" />} />
        <Route path="/signin" element={<Navigate to="/signin/user" />} />

      </Routes>
    </Router>
    </>

  );
}

export default App;
