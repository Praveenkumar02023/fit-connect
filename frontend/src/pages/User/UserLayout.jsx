import { Outlet } from 'react-router-dom';
import Sidebar from "../../components/User-Dashboard/Sidebar";

const UserLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;