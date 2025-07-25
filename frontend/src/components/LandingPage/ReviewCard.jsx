import React from "react";

const ReviewCard = ({ name, username, image, review }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-64 sm:w-72 flex flex-col items-center text-center">
      <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover mb-2" />
      <h4 className="font-bold text-sm sm:text-base">{name}</h4>
      <span className="text-xs text-gray-500">{username}</span>
      <p className="text-sm text-gray-600 mt-2">{review}</p>
    </div>
  );
};

export default ReviewCard;
