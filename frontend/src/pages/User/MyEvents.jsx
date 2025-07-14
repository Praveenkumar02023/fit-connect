import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import EventCard from "../../components/User-Dashboard/EventCard";
import { StoreContext } from "../../Context/StoreContext";
import { toast, ToastContainer } from "react-toastify";

const MyEvents = () => {
  const { token, url } = useContext(StoreContext);
  const [events, setEvents] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const fetchRegisteredEvents = async () => {
    try {
      const res = await axios.post(
        `${url}/api/v1/event/UserRegisteredEvents`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(res.data.events);
    } catch (err) {
      console.log("Failed to fetch events", err);
    }
  };

  const cancelRegistration = async (eventId) => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this session?"
    );
    if (!confirm) return;
    try {
      await axios.post(
        `${url}/api/v1/event/cancel`,
        { eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        "Your session has been cancelled successfully. Refund will be processed soon."
      );
      fetchRegisteredEvents();
    } catch (err) {
      console.error("Failed to cancel", err);
    }
  };

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    return (
      event.type?.toLowerCase().includes(typeFilter.toLowerCase()) &&
      event.location?.toLowerCase().includes(locationFilter.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 px-6 py-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl shadow-lg p-8 mb-10">
          <h1 className="text-4xl font-bold mb-2">🏋‍♂ My Events</h1>
          <p className="text-blue-100 text-lg">
            View and manage your registered fitness events
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            placeholder="Search by type (e.g., Boxing)"
            className="border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-2 rounded-lg w-full shadow-sm transition-all duration-200"
          />
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Search by location (e.g., Mumbai)"
            className="border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-2 rounded-lg w-full shadow-sm transition-all duration-200"
          />
        </div>

        {/* Event Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No events found.
            </p>
          ) : (
            filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onCancel={cancelRegistration}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyEvents;