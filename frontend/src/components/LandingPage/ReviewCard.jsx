import React from "react";

const ReviewCard = ({ name, username, image, review }) => {
  return (
    <div
      className="
        bg-white shadow-md rounded-2xl 
        w-80 h-64 
        flex flex-col items-center text-center 
        px-6 py-6
        whitespace-normal
      "
    >
      {/* Avatar */}
      <img
        src={image}
        alt={name}
        className="h-16 w-16 rounded-full object-cover mb-4"
      />

      {/* Name */}
      <h2 className="text-lg font-semibold text-gray-900">{name}</h2>

      {/* Username */}
      <p className="text-sm text-gray-500 mb-3">{username}</p>

      {/* Review */}
      <p className="text-gray-700 text-sm line-clamp-4 leading-relaxed">
        {review}
      </p>
    </div>
  );
};

export default ReviewCard;
