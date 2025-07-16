import React from 'react'
import Sidebar from "../../components/Trainer-Dashboard/Sidebar"
import { Outlet } from 'react-router-dom';

const TrainerLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
  
}

export default TrainerLayout
