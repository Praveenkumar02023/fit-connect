import "./App.css";
import { Toaster } from "react-hot-toast";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Feed from "./components/Feed";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signup/:role" element={<Signup />} />
        <Route path="/signin/:role" element={<Signin />} />

        {/* Redirects to default 'user' role */}
        <Route path="/signup" element={<Navigate to="/signup/user" />} />
        <Route path="/signin" element={<Navigate to="/signin/user" />} />

        <Route path="/Feed" element={<Feed/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
