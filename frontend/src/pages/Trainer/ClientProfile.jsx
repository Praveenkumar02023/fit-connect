import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { useParams } from "react-router-dom";
import LogoLoader from "../../components/LogoLoader";

const ViewClientProfile = () => {
  const { token, url } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const { clientId } = useParams();
  
  
  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await axios.get(`${url}/api/v1/user/${clientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching client profile:", error);
      }
    }

    fetchClient();
  }, [clientId]);

  if (!user)
    return (
      <LogoLoader/>
    );

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 overflow-hidden">
      {/* Decorative Bubbles */}
      <div className="absolute z-0 inset-0 overflow-hidden">
        <div className="absolute top-10 left-0 w-40 h-40 bg-blue-400 opacity-50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-16 w-48 h-48 bg-purple-400 opacity-30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300 opacity-30 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Profile Card */}
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 rounded-xl border border-gray-300 bg-gray-50 shadow flex flex-col items-center space-y-4 z-10">
        {/* Avatar */}
        <img
          src={user.avatar || "https://www.gravatar.com/avatar/?d=mp"}
          alt="User"
          className="w-24 sm:w-28 h-24 sm:h-28 rounded-full border-2 border-black object-cover"
        />

        {/* Name */}
        <div className="w-full">
          <label className="text-sm font-medium">Name</label>
          <div className="w-full px-3 py-2 mt-1 border rounded text-sm bg-white text-gray-700">
            {user.name || "N/A"}
          </div>
        </div>

        {/* Gender */}
        <div className="w-full">
          <label className="text-sm font-medium">Gender</label>
          <div className="w-full px-3 py-2 mt-1 border rounded text-sm bg-white text-gray-700">
            {user.gender ? capitalize(user.gender) : "Not specified"}
          </div>
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
      </div>

      {/* Footer */}
      <footer className="absolute bottom-36 text-xs text-gray-400 text-center z-10">
        © 2025 FitConnect. All rights reserved.
      </footer>
    </div>
  );
};

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export default ViewClientProfile;
