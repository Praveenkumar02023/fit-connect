import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Home from './components/Home';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup/:role" element={<Signup />} />
                <Route path="/signin/:role" element={<Signin />} />
        
                {/* Redirects to default 'user' role */}
                <Route path="/signup" element={<Navigate to="/signup/user" />} />
                <Route path="/signin" element={<Navigate to="/signin/user" />} />
      </Routes>
    </Router>
  );
}

export default App;





