import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Signin from './components/Signin';
import Signup from './components/Signup';
import Home from './components/Home';

import Dashboard from './pages/User/Dashboard';
import BookSessions from './pages/User/BookSessions';
import UserSubscriptionLanding from './pages/User/subscriptions';
import UserLayout from './pages/User/UserLayout';
import ViewSubscriptions from './pages/User/ViewSubscriptions';
import UpdateProfile from './pages/User/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Nested User Layout */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* User Routes outside layout */}
        <Route path="/user/bookSessions" element={<BookSessions />} />
        <Route path="/user/subscriptions" element={<UserSubscriptionLanding />} />
        <Route path="/user/subscriptions/view" element={<ViewSubscriptions />} />
         <Route path="/user/profile" element={<UpdateProfile />} />
        
      </Routes>
    </Router>
  );
}

export default App;
