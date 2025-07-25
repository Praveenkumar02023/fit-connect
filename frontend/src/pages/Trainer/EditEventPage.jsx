import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";
import {
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaImage,
  FaTrophy,
  FaMoneyBill,
} from "react-icons/fa";
import Footer from "../../components/LandingPage/Footer";

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
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);

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
        });
        setSelectedImage(event.image);
      } catch (err) {
        console.error("Failed to fetch event data");
      }
    };
    fetchFormData();
  }, [eventId, token, url]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, val]) =>
        formPayload.append(
          key,
          key === "prizePool" || key === "registrationFee" ? Number(val) : val
        )
      );
      formPayload.append("eventId", eventId);
      if (image) formPayload.append("image", image);

      await axios.patch(`${url}/api/v1/event/update`, formPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Event updated successfully!");
      setTimeout(() => navigate("/trainer/events"), 2000);
    } catch (err) {
      console.error("Failed to update event", err);
      toast.error("Error updating event");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-purple-100 via-white to-blue-100">
      <div className="absolute top-10 left-10 w-56 h-56 bg-purple-300/50 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-20 right-12 w-72 h-72 bg-pink-400/50 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-blue-300/50 rounded-full blur-2xl z-0" />
      <div className="absolute top-[60%] right-1/4 w-40 h-40 bg-yellow-300/50 rounded-full blur-2xl z-0" />
      <div className="absolute top-[80%] left-[10%] w-32 h-32 bg-green-300/50 rounded-full blur-2xl z-0" />

      <div className="relative z-10 max-w-3xl w-full mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-black text-center mb-8">Edit Event</h2>

        <form
          onSubmit={handleUpdate}
          className="bg-gray-50 border border-gray-300 p-6 md:p-8 rounded-xl shadow-lg space-y-6"
        >
          <div>
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
              <FaUser /> Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 p-3 rounded-md"
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
              className="w-full bg-white border border-gray-300 p-3 rounded-md"
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
              className="w-full bg-white border border-gray-300 p-3 rounded-md"
              required
            >
              <option value="">Select event type</option>
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
              className="w-full bg-white border border-gray-300 p-3 rounded-md"
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
              className="w-full bg-white border border-gray-300 p-3 rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
              <FaMoneyBill /> Registration Fee (₹)
            </label>
            <input
              type="number"
              name="registrationFee"
              value={formData.registrationFee}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 p-3 rounded-md"
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
              className="w-full bg-white border border-gray-300 p-3 rounded-md"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
              <FaImage /> Banner Image
            </label>
            <div className="relative bg-white border border-dashed border-gray-400 h-[150px] rounded-md overflow-hidden flex items-center justify-center hover:bg-gray-50 cursor-pointer transition">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-500">Click to upload an image</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold"
            >
              Update Event
            </button>
          </div>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default EditEventPage;
