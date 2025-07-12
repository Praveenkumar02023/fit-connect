import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Signin from './components/Signin';
import Signup from './components/Signup';
import Home from './components/Home';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Dashboard from './pages/User/Dashboard';
import BookSessions from './pages/User/BookSessions';
import UserLayout from './pages/User/UserLayout';
import ViewSubscriptions from './pages/User/ViewSubscriptions';
import UpdateProfile from './pages/User/UserProfile';
import SessionSuccess from './pages/User/SessionSuccess';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Layout with nested routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Dashboard />} /> 
          <Route path="bookSessions" element={<BookSessions />} />
          <Route path="subscriptions" element={<ViewSubscriptions />} />
          <Route path="profile" element={<UpdateProfile />} />
        </Route>
         <Route path="/session-success" element={<SessionSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
