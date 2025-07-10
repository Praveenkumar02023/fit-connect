import React from 'react';
import { FaCreditCard, FaChartLine, FaBullseye, FaCalendarAlt } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-blue-500 text-white p-6 rounded-xl mb-6">
        <h2 className="text-2xl font-bold mb-1">Welcome back, John! 💪</h2>
        <p className="text-sm text-gray-200">
          Ready to crush your fitness goals today? You've got 2 upcoming sessions this week.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
          <div>
            <p className="text-sm text-gray-500">Active Subscription</p>
            <h3 className="text-xl font-semibold">Premium</h3>
            <p className="text-sm text-gray-500">Expires in 23 days</p>
            <p className="text-xs text-blue-500 mt-1">+Renewed vs last month</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-md">
            <FaCreditCard className="text-blue-500 text-xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
          <div>
            <p className="text-sm text-gray-500">This Month</p>
            <h3 className="text-xl font-semibold">12</h3>
            <p className="text-sm text-gray-500">Sessions completed</p>
            <p className="text-xs text-blue-500 mt-1">+3 vs last month</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-md">
            <FaChartLine className="text-blue-500 text-xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
          <div>
            <p className="text-sm text-gray-500">Goal Progress</p>
            <h3 className="text-xl font-semibold">85%</h3>
            <p className="text-sm text-gray-500">Monthly target</p>
            <p className="text-xs text-blue-500 mt-1">+12% vs last month</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-md">
            <FaBullseye className="text-blue-500 text-xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
          <div>
            <p className="text-sm text-gray-500">Next Session</p>
            <h3 className="text-xl font-semibold">Today</h3>
            <p className="text-sm text-gray-500">3:00 PM - Yoga</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-md">
            <FaCalendarAlt className="text-blue-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border border-blue-200 transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
          <h3 className="text-lg font-semibold mb-2">Book a New Session</h3>
          <p className="text-sm text-gray-600 mb-4">
            Schedule your next workout with our certified trainers.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Book Now
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-blue-200 transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
          <h3 className="text-lg font-semibold mb-2">Join Upcoming Events</h3>
          <p className="text-sm text-gray-600 mb-4">
            Participate in group fitness challenges and community events.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            View Events
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex flex-col hover:bg-blue-50 p-2 rounded">
            <p className="font-semibold">✅ Completed HIIT Training</p>
            <p className="text-gray-500 text-sm">2 hours ago</p>
          </li>
          <li className="flex flex-col hover:bg-blue-50 p-2 rounded">
            <p className="font-semibold">📅 Booked Yoga Session</p>
            <p className="text-gray-500 text-sm">Yesterday</p>
          </li>
          <li className="flex flex-col hover:bg-blue-50 p-2 rounded">
            <p className="font-semibold">🎯 Joined Fitness Challenge</p>
            <p className="text-gray-500 text-sm">2 days ago</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
