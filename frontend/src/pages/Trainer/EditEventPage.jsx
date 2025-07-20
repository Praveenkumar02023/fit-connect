import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import {
  FaUser, FaImage, FaMoneyBill, FaTrophy,
  FaMapMarkerAlt, FaCalendarAlt
} from "react-icons/fa";
import { toast } from "react-toastify";

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    location: "",
    prizePool: "",
    registrationFee: "",
    date: "",
    eventId: eventId,
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const event = res.data.event;
        setFormData({
          title: event.title,
          description: event.description,
          type: event.type,
          location: event.location,
          prizePool: Number(event.prizePool),
          registrationFee: Number(event.registrationFee),
          date: event.date.split("T")[0],
          eventId: eventId,
        });
      } catch (err) {
        console.error("Failed to fetch event data");
      }
    };
    fetchFormData();
  }, [eventId, token, url]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${url}/api/v1/event/update`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Event updated successfully!");
      setTimeout(() => {
        navigate("/trainer/events");
      }, 2500);
    } catch (err) {
      console.log("Failed to update event", err);
    }
  };

  return (
    <div className="px-4 py-10 flex justify-center bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Edit Event</h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
              <FaUser /> Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-blue-50 p-3 rounded-md focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={300}
              className="w-full bg-blue-50 p-3 rounded-md focus:outline-none"
              required
            />
            <p className="text-right text-sm text-gray-400">
              {formData.description.length}/300 characters
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Event Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-blue-50 p-3 rounded-md"
              required
            >
              <option value="">Select Type</option>
              <option value="Cardio">Cardio</option>
              <option value="Strength">Strength</option>
              <option value="Yoga">Yoga</option>
              <option value="Boxing">Boxing</option>
              <option value="HIIT">HIIT</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
              <FaMapMarkerAlt /> Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-blue-50 p-3 rounded-md"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
              <FaTrophy /> Prize Pool (₹)
            </label>
            <input
              type="number"
              name="prizePool"
              value={formData.prizePool}
              onChange={handleChange}
              className="w-full bg-blue-50 p-3 rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
              <FaMoneyBill /> Registeration Fee (₹)
            </label>
            <input
              type="number"
              name="registrationFee"
              value={formData.registrationFee}
              onChange={handleChange}
              className="w-full bg-blue-50 p-3 rounded-md"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
              <FaCalendarAlt /> Event Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-blue-50 p-3 rounded-md"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
              <FaImage /> Banner Image
            </label>
            <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm border border-dashed border-gray-300">
              Image cannot be updated
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold"
            >
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
