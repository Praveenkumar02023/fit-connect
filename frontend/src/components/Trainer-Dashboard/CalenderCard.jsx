import React from "react";
import PropTypes from "prop-types";
import { CalendarDays } from "lucide-react";


const CalenderCard = ({ onClick }) => {
  return (
    <div className="bg-gray-50 border border-gray-300 rounded-2xl shadow-md p-6 w-full flex items-center justify-between  hover:shadow-lg transition-all h-30">
      {/* Left section: icon + text */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <CalendarDays className="text-blue-600 w-6 h-6 mt-1" />
        {/* Text */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">View This Month's Calendar</h2>
          <p className="text-gray-500 text-sm">Click below to open and view your scheduled sessions.</p>
        </div>
      </div>

      {/* Right section: Button */}
      <button
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-6 rounded-lg transition"
      >
        View Calendar
      </button>
    </div>
  );
};

CalenderCard.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CalenderCard;