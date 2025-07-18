import React from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './CustomCalender.css';
import { Dialog } from "@headlessui/react";

const CalendarModal = ({ isOpen, onClose, sessionDates = [] }) => {
  const markedDates = sessionDates.map(dateStr =>
    new Date(dateStr).toDateString()
  );

  const tileClassName = ({ date, view }) => {
    if (view === "month" && markedDates.includes(date.toDateString())) {
      return "highlight-date";
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="min-h-screen flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transition-all">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-900">Your Session Calendar</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black text-xl font-bold">
              &times;
            </button>
          </div>

          {/* Calendar */}
          <Calendar tileClassName={tileClassName} className="custom-calendar" />

          {/* Legend */}
          <div className="mt-4 text-sm text-gray-600">
            <span className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
            Dates with sessions
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CalendarModal;
