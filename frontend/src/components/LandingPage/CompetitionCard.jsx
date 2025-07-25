import React from "react";

const CompetitionCard = ({ title, organizer, views, image }) => {
  return (
    <div className="min-w-[250px] sm:min-w-[220px] md:min-w-[290px] max-w-xs bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-center">
      <img src={image} alt={organizer} className="h-16 w-16 object-contain mb-3" />
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">by {organizer}</p>
      <span className="text-sm text-gray-500">👀 {views?.toLocaleString()} views</span>
    </div>
  );
};

export default CompetitionCard;
