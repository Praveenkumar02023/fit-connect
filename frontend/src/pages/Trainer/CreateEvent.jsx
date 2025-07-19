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

const CreateEvent = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    location: '',
    prizePool: '',
    registerationFee: '',
    date: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('type', formData.type);
      formPayload.append('location', formData.location);
      formPayload.append('prizePool', Number(formData.prizePool));
      formPayload.append('registerationFee', Number(formData.registerationFee));
      formPayload.append('date', formData.date);
      if (image) {
        formPayload.append('image', image);
      }

      const res = await axios.post(`${url}/api/v1/event/create`, formPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.message === 'Event created successfully') {
        toast.success('Event Created Successfully');
        setTimeout(() => {
            navigate('/trainer/events');
        }, 1500);
      } else {
        alert('Error in creating event');
      }
    } catch (error) {
      console.error('Error in creating event', error);
    }
  };

  return (
    <div className="bg-gray-50">
        <ToastContainer />
      {/* Hero Section */}

      {/* Form Section */}
      <div className="px-4 py-10 flex justify-center bg-gray-50">
        <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Create Event</h2>

          <form onSubmit={onSubmit} className="space-y-5">
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
                className="w-full bg-blue-50 p-3 rounded-md focus:outline-none"
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
                className="w-full bg-blue-50 p-3 rounded-md focus:outline-none"
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
                className="w-full bg-blue-50 p-3 rounded-md"
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
                className="w-full bg-blue-50 p-3 rounded-md"
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
                className="w-full bg-blue-50 p-3 rounded-md"
              />
            </div>

            {/* Registration Fee */}
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
                <FaMoneyBill /> Registration Fee (₹)
              </label>
              <input
                type="number"
                name="registerationFee"
                value={formData.registerationFee}
                onChange={handleChange}
                className="w-full bg-blue-50 p-3 rounded-md"
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
                className="w-full bg-blue-50 p-3 rounded-md"
                required
              />
            </div>

            {/* Poster Image */}
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
                <FaImage /> Banner Image
              </label>
              <label className="bg-blue-50 h-[120px] rounded-md text-center hover:bg-blue-100 transition duration-200 cursor-pointer block">
                {selectedImage ? (
                <div className="mb-2 rounded-md overflow-hidden h-[120px]">
                  <img
                    src={selectedImage}
                    alt="Selected Preview"
                    className="w-full h-full rounded-md object-cover"
                  />
                  </div>
                ) : (
                  <span className="text-gray-500 text-center">Click to upload an image</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
