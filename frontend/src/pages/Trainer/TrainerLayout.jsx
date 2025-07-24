import React from 'react';
import { Outlet } from 'react-router-dom';
import TrainerNavbar from '../../components/Trainer-Dashboard/TrainerNavbar';

const TrainerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TrainerNavbar />
      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default TrainerLayout;
