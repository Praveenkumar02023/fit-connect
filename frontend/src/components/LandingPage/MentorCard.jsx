import React from "react";

const MentorCard = ({ name, image, role, rating }) => {
  return (
    <div className="min-w-[250px] sm:min-w-[220px] md:min-w-[270px] max-w-xs bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center">
      <img
        src={image}
        alt={name}
        className="w-24 h-24 rounded-full object-cover mb-3"
      />
      <h3 className="text-base font-semibold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-500 mb-2">{role}</p>
      <div className="text-sm font-semibold text-yellow-500">⭐ {rating}</div>
    </div>
  );
};

export default MentorCard;