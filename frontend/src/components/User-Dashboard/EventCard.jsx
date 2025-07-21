import React from 'react';

const EventCard = ({ event, onCancel }) => {
  return (
    <div className="flex flex-col justify-between bg-white shadow rounded-2xl p-6 w-full max-w-sm">
     <div className='bg-neutral-100 flex w-full justify-center' >
       <img  className='h-36 w-36' src={event.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZcnsKC3iF9pB8_po80WXkn7h_3fd2bNx-Rq9T6B_mCx3IDZsdPjG8qNYt0pPC_YhJEA&usqp=CAU"} alt="" />
     </div>
      <div className="mt-4 flex justify-between items-center mb-2">
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

      <span className="flex justify-center text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-1 font-medium mb-2 w-[4.5rem]">
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
