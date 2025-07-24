import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import toast, { Toaster } from "react-hot-toast";
import { MapPin, Clock, Trophy, IndianRupee, X, Search } from "lucide-react";
import Footer from "../../components/LandingPage/Footer";

const MyEvents = () => {
  const { token, url } = useContext(StoreContext);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");

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

  const cancelRegistration = async () => {
    try {
      await axios.post(
        `${url}/api/v1/event/cancel`,
        { eventId: selectedEventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Your session has been cancelled. Refund will be processed soon.");
      fetchRegisteredEvents();
    } catch (err) {
      console.error("Failed to cancel", err);
      toast.error("Failed to cancel the session. Try again.");
    } finally {
      setShowConfirm(false);
      setSelectedEventId(null);
      setSelectedEventTitle("");
    }
  };

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const search = searchTerm.toLowerCase();
    return (
      event.type?.toLowerCase().includes(search) ||
      event.location?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-blue-50 to-blue-100 relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Background Bubble Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-pink-300 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-[200px] right-[300px] w-96 h-96 bg-violet-300/70 rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-[70%] left-[25%] w-80 h-80 bg-orange-200 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[300px] left-[60px] w-72 h-72 bg-lime-300/70 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[100px] right-[60px] w-64 h-64 bg-rose-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[120px] left-[40%] w-96 h-96 bg-indigo-200/40 rounded-full blur-[120px] opacity-10 animate-pulse" />
        <div className="absolute top-[20%] left-[1%] w-96 h-96 bg-emerald-200/90 rounded-full blur-[120px] opacity-30 animate-pulse" />
      </div>

      <div className="flex-grow relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black">My Events</h1>
          <p className="text-black mt-2">
            View and manage your registered fitness events
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search by type or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 w-full rounded-xl border border-gray-300 shadow-md bg-transparent backdrop-blur-sm focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all duration-200"
          />
        </div>

        {/* Event Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((e) => (
              <div
                key={e._id}
                className="relative bg-white h-[430px] max-w-[300px] rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col justify-between"
              >
                <img
                  src={e.avatar || "https://i.imgur.com/7s4U6vF.png"}
                  alt={e.title}
                  className="h-42 w-full object-cover rounded-lg"
                />
                <h3 className="text-blue-700 font-semibold text-lg mt-3 text-center">
                  {e.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2 text-center">
                  {e.description}
                </p>

                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="truncate">{e.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{formatDate(e.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Prize: ₹{e.prizePool}</span>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Fee: ₹{e.registrationFee}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedEventId(e._id);
                    setSelectedEventTitle(e.title);
                    setShowConfirm(true);
                  }}
                  className="w-full h-9 mt-3 text-white bg-red-500 hover:bg-red-600 transition-all duration-300 rounded-md flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                  Cancel Registration
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-16">
              No events found.
            </p>
          )}
        </div>
      </div>

      {/* Custom Cancel Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">Cancel Registration?</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to cancel your registration for{" "}
              <span className="font-semibold text-red-600">{selectedEventTitle}</span>?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-sm rounded-md"
              >
                No, Keep
              </button>
              <button
                onClick={cancelRegistration}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyEvents;
