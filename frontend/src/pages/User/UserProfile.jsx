import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import Footer from "../../components/LandingPage/Footer";

const UserProfile = () => {
  const { token, url } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    avatar: null,
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${url}/api/v1/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data.user;
        setUser(u);
        setPreview(u.avatar || "https://www.gravatar.com/avatar/?d=mp");
        setFormData({
          name: u.name || "",
          gender: u.gender || "",
          avatar: null,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, avatar: null }));
    setPreview("https://www.gravatar.com/avatar/?d=mp");
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("gender", formData.gender);
      if (formData.avatar) data.append("image", formData.avatar);

      const res = await axios.patch(`${url}/api/v1/user/update`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status !== 200) {
        alert("Update failed");
        return;
      }

      const profileRes = await axios.get(`${url}/api/v1/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profileRes.status === 200) {
        const updatedUser = profileRes.data.user;
        setUser(updatedUser);
        setFormData({
          name: updatedUser.name || "",
          gender: updatedUser.gender || "",
          avatar: null,
        });
        setPreview(updatedUser.avatar || "https://www.gravatar.com/avatar/?d=mp");
        setEditMode(false);
      }
    } catch (err) {
      alert("Update failed");
      console.error(err);
    }
  };

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-10  overflow-hidden">
      {/* Background bubbles */}
      <div className="absolute z-0 inset-0 overflow-hidden">
        <div className="absolute top-10 left-0 w-40 h-40 bg-blue-400 opacity-50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-16 w-48 h-48 bg-purple-400 opacity-30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300 opacity-30 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Profile Card */}
      <div className="relative w-full max-h-screen max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 rounded-xl border border-gray-300 bg-gray-50 shadow flex flex-col items-center space-y-4 z-10">
        {/* Avatar */}
        <img
          src={preview}
          alt="User"
          className="w-24 sm:w-28 h-24 sm:h-28 rounded-full border-2 border-black object-cover"
        />

        {/* Image controls in edit mode */}
        {editMode && (
          <div className="flex flex-col items-center space-y-2">
            <label className="bg-blue-600 text-white text-sm px-4 py-1 rounded cursor-pointer hover:bg-blue-700 transition">
              Change Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <button
              onClick={handleRemoveImage}
              className="text-sm text-red-500 hover:underline"
            >
              Remove Image
            </button>
          </div>
        )}

        {/* Name */}
        <div className="w-full">
          <label className="text-sm font-medium">Name</label>
          {editMode ? (
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded text-sm"
            />
          ) : (
            <div className="w-full px-3 py-2 mt-1 border rounded text-sm bg-white text-gray-700">
              {user.name || "N/A"}
            </div>
          )}
        </div>

        {/* Gender */}
        <div className="w-full">
          <label className="text-sm font-medium">Gender</label>
          {editMode ? (
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded text-sm"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : (
            <div className="w-full px-3 py-2 mt-1 border rounded text-sm bg-white text-gray-700">
              {user.gender ? capitalize(user.gender) : "Not specified"}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="w-full">
          <label className="text-sm font-medium">Email</label>
          <div className="w-full px-3 py-2 mt-1 border rounded text-sm bg-white text-gray-700">
            {user.email || "N/A"}
          </div>
        </div>

        {/* Join Date */}
        <div className="text-sm text-gray-500 mt-1">
          Joined on:{" "}
          {user.createdAt
            ? new Date(user.createdAt).toISOString().split("T")[0]
            : "N/A"}
        </div>

        {/* Buttons */}
        <div className="w-full mt-4">
          {editMode ? (
            <div className="flex gap-2 flex-col sm:flex-row">
              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    name: user.name || "",
                    gender: user.gender || "",
                    avatar: null,
                  });
                  setPreview(user.avatar || "https://www.gravatar.com/avatar/?d=mp");
                }}
                className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
            >
              Edit Info
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export default UserProfile;
