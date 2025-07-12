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
       toast.success("Your session has been cancelled successfully. Refund will be processed soon.");
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
    <div className="min-h-screen bg-[#f9fafb] px-6 py-12">
        <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Events</h1>
        <p className="text-gray-500 mb-6">
          View and manage your registered fitness events
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            placeholder="Search by type (e.g., Boxing)"
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Search by location (e.g., Mumbai)"
            className="border px-4 py-2 rounded-lg w-full"
          />
        </div>

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
