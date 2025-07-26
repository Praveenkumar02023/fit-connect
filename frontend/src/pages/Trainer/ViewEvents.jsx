import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Trophy,
  IndianRupee,
  Trash2,
  Check,
} from "lucide-react";
import Footer from "../../components/LandingPage/Footer";
import LogoLoader from "../../components/LogoLoader";

const TrainerEvents = () => {
  const [events, setEvents] = useState([]);
  const { url, token } = useContext(StoreContext);
  const [loading,setLoading] = useState(true);
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
    }finally{
      setLoading(false);
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

  if(loading) return <LogoLoader/>

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-white to-blue-100 overflow-hidden">
      {/* Decorative Bubbles */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-purple-300/40 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-300/40 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-blue-200/40 rounded-full blur-2xl z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-6 flex-1">
        <h2 className="text-3xl font-bold text-black mb-6 text-center ">
          My Events
        </h2>
        <h2 className="text-md  text-black/80 mt-[-24px] mb-6 text-center ">
         Manage your created events
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full text-center text-gray-600">
              No events created yet.
            </div>
          ) : (
            events.map((e) => (
              <div
                key={e._id}
                className="relative bg-gray-50 rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col justify-between h-full"
              >
                <img
                  src={e.avatar || "https://i.imgur.com/7s4U6vF.png"}
                  alt={e.title}
                  className="h-36 w-full object-cover rounded-lg"
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
                    <span>{new Date(e.date).toDateString()}</span>
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

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => deleteEvent(e._id)}
                    className="w-1/2 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/trainer/event/edit/${e._id}`)}
                    className="w-1/2 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    Update
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default TrainerEvents;
