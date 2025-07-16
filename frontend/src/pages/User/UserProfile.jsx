import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";

const UserProfile = () => {
  const { token, url } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState("");
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value || "" }));
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
        setUser(profileRes.data.user);
        setFormData({
          name: profileRes.data.user.name || "",
          gender: profileRes.data.user.gender || "",
          avatar: null,
        });
        setPreview(profileRes.data.user.avatar || "https://www.gravatar.com/avatar/?d=mp");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[24rem] p-6 rounded-xl shadow bg-white flex flex-col items-center space-y-4">
        {/* Avatar */}
        <img
          src={preview}
          alt="User"
          className="w-28 h-28 rounded-full border-2 border-black object-cover"
        />

        {/* Change/Remove image (only in edit mode) */}
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
          <input
            type="text"
            name="name"
            disabled={!editMode}
            value={formData.name || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 mt-1 border rounded text-sm ${
              editMode ? "" : "bg-gray-100 text-gray-600"
            }`}
          />
        </div>

        {/* Gender */}
        <div className="w-full">
          <label className="text-sm font-medium">Gender</label>
          {editMode ? (
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded text-sm"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : (
            <div className="w-full px-3 py-2 mt-1 border rounded text-sm bg-gray-100 text-gray-600">
              {formData.gender
                ? capitalize(formData.gender)
                : "Not specified"}
            </div>
          )}
        </div>

        {/* Email (non-editable) */}
        <div className="w-full">
          <label className="text-sm font-medium">Email</label>
          <input
            type="text"
            value={user.email || ""}
            disabled
            className="w-full px-3 py-2 mt-1 border rounded bg-gray-100 text-gray-600 text-sm"
          />
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
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
              >
                Save Changes
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
    </div>
  );
};

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export default UserProfile;
