import React from 'react';

const EventCard = ({ event, onCancel }) => {
  return (
    <div className="bg-white shadow rounded-2xl p-6 w-full max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{event.title}</h2>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${
            event.status === "Registered"
              ? "bg-green-100 text-green-700"
              : event.status === "Cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {event.status}
        </span>
      </div>

      <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-1 font-medium mb-2 inline-block">
        {event.type}
      </span>

      <div className="text-sm text-gray-600 space-y-1 mt-2">
        <p>📍 {event.location}</p>
        <p>
          📅{" "}
          {new Date(event.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
        <p>🏆 Prize Pool: ₹{event.prizePool}</p>
        <p>💰 Registration Fee: ₹{event.registrationFee}</p>
      </div>

      {onCancel && (
        <button
          onClick={() => onCancel(event._id)}
          className="mt-4 w-full bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 font-medium"
        >
          Cancel Registration
        </button>
      )}
    </div>
  );
};

export default EventCard;
