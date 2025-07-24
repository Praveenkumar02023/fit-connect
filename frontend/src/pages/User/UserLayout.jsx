import { Outlet } from 'react-router-dom';
import Navbar from "../../components/User-Dashboard/Navbar"; // make sure this is the updated one

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
