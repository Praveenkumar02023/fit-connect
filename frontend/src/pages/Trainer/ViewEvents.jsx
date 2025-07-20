import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaCalendarAlt,
  FaTrash,
  FaCheck,
  FaTrophy,
} from "react-icons/fa";

const TrainerEvents = () => {
  const [events, setEvents] = useState([]);
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/event/trainer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data.events);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await axios.post(
        `${url}/api/v1/event/delete`,
        { eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-blue-800">Your Created Events</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">No events created yet.</div>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow hover:shadow-md border transition-transform hover:scale-[1.02] flex flex-col"
            >
              {/* Image & Status */}
              <div className="relative w-full h-40 rounded-t-xl overflow-hidden">
                <img
                  src={
                    event.avatar ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZcnsKC3iF9pB8_po80WXkn7h_3fd2bNx-Rq9T6B_mCx3IDZsdPjG8qNYt0pPC_YhJEA&usqp=CAU"
                  }
                  alt="event"
                  className="w-full h-full object-cover"
                />

                <span
                  className={`absolute top-2 right-2 text-xs font-medium px-3 py-1 rounded-full shadow-sm ${
                    event.status === "upcoming"
                      ? "bg-green-200 text-green-800"
                      : event.status === "ongoing"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold mb-1 text-blue-900">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>

                <div className="flex items-center text-sm text-gray-700 mb-1">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-700 mb-1">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  {new Date(event.date).toDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-700 mb-1">
                  <FaTrophy className="mr-2 text-blue-500" />
                  Prize: ₹{event.prizePool}
                </div>
                <div className="flex items-center text-sm text-gray-700 mb-3">
                  <FaRupeeSign className="mr-2 text-blue-500" />
                  Registration Fee: ₹{event.registrationFee}
                </div>
              

                {/* Buttons inside card */}
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="w-1/2 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FaTrash />
                    Delete
                  </button>

                  <button
                    onClick={() => navigate(`/trainer/event/edit/${event._id}`)}
                    className="w-1/2 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FaCheck />
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrainerEvents;
