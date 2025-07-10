import React from 'react';
import { FaDumbbell, FaUserCircle, FaUserFriends, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserSubscriptionLanding = () => {
  return (
    <div className="bg-[#f5faff] min-h-screen">
      
      <div className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
        <div className="flex items-center gap-2">
          <FaDumbbell className="text-blue-600 text-2xl" />
          <h1 className="text-xl font-bold text-blue-600">FitConnect</h1>
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/user"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
          >
            Dashboard
          </Link>
          <FaUserCircle className="text-2xl text-gray-600" />
        </div>
      </div>

      
      <div className="text-center mt-12 mb-12 px-4">
        <div className="flex justify-center items-center gap-3">
          <FaDumbbell className="text-blue-600 text-3xl" />
          <h2 className="text-3xl font-bold text-gray-800">FitConnect</h2>
        </div>
        <p className="text-gray-600 text-lg mt-3 max-w-xl mx-auto">
          Your premier fitness platform connecting you with professional trainers and
          managing your fitness journey.
        </p>
      </div>

     
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 mt-8">
        
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="text-3xl text-blue-500 mb-3"><FaUserFriends /></div>
          <h3 className="font-semibold text-lg mb-1">Expert Trainers</h3>
          <p className="text-gray-600 text-sm">
            Connect with certified fitness professionals specialized in various disciplines.
          </p>
        </div>

        {/* Flexible Scheduling */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="text-3xl text-green-500 mb-3"><FaCalendarAlt /></div>
          <h3 className="font-semibold text-lg mb-1">Flexible Scheduling</h3>
          <p className="text-gray-600 text-sm">
            Book sessions at your convenience with our easy-to-use scheduling system.
          </p>
        </div>

        {/* Subscription Management */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="text-3xl text-purple-500 mb-3"><FaCreditCard /></div>
          <h3 className="font-semibold text-lg mb-1">Subscription Management</h3>
          <p className="text-gray-600 text-sm">
            Easily manage your trainer subscriptions and track your fitness investments.
          </p>
        </div>
      </div>

      {/* CTA Button */}
       <div className="mt-14 bg-blue-600 text-white text-center py-10 px-4 rounded-xl max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Ready to Transform Your Fitness Journey?
        </h2>
        <p className="mb-6 text-sm md:text-base">
          View and manage your trainer subscriptions in our comprehensive dashboard.
        </p>
        <Link to="/user/subscriptions/view">
          <button className="bg-white text-blue-600 px-6 py-2 font-medium rounded hover:bg-blue-100">
            View My Subscriptions
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserSubscriptionLanding;
