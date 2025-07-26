import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { toast, ToastContainer } from 'react-toastify';
import {
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaImage,
  FaTrophy,
  FaMoneyBill,
} from 'react-icons/fa';
import Footer from '../../components/LandingPage/Footer';
import LogoLoader from '../../components/LogoLoader';

const CreateEvent = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    location: '',
    prizePool: '',
    registrationFee: '',
    date: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, val]) =>
        formPayload.append(key, key === 'prizePool' || key === 'registrationFee' ? Number(val) : val)
      );
      if (image) formPayload.append('image', image);

      const res = await axios.post(`${url}/api/v1/event/create`, formPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.message === 'Event created successfully') {
        toast.success('Event Created Successfully');
        setTimeout(() => navigate('/trainer/events'), 1500);
      } else {
        toast.error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Error creating event');
    }
  };



  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-purple-100 via-white to-blue-100">
      <ToastContainer />

      {/* Decorative Bubbles */}
      <div className="absolute top-10 left-10 w-56 h-56 bg-purple-300/50 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-20 right-12 w-72 h-72 bg-pink-400/50 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-blue-300/50 rounded-full blur-2xl z-0" />
      <div className="absolute top-[60%] right-1/4 w-40 h-40 bg-yellow-300/50 rounded-full blur-2xl z-0" />
      <div className="absolute top-[80%] left-[10%] w-32 h-32 bg-green-300/50 rounded-full blur-2xl z-0" />

      <div className="relative z-10 max-w-3xl w-full mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-black text-center mb-8">Create Event</h2>

        <form
          onSubmit={onSubmit}
          className="bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-6"
        >
          {/* Event Title */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
              <FaUser /> Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Morning Yoga Session"
              className="w-full bg-white border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event..."
              rows={4}
              maxLength={300}
              className="w-full bg-white border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <p className="text-right text-sm text-gray-400">
              {formData.description.length}/300 characters
            </p>
          </div>

          {/* Event Type */}
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

          {/* Location */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
              <FaMapMarkerAlt /> Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Central Park, Mumbai"
              className="w-full bg-white border border-gray-300 p-3 rounded-md"
              required
            />
          </div>

          {/* Prize Pool */}
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

          {/* Registration Fee */}
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

          {/* Date */}
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

          {/* Banner Image Upload */}
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

          {/* Submit Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CreateEvent;
