import { Outlet } from 'react-router-dom';
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

const UserLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 overflow-y-auto flex flex-col">
        <Topbar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
