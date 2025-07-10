import React from "react";
import { Eye, Users } from "lucide-react";

const CompetitionCard = ({ title, organizer, tags, views, applied, image }) => {
  return (
    <div className="min-w-[290px] max-w-[290px] h-[225px] rounded-xl bg-white border shadow-sm flex flex-col overflow-hidden relative">
      {/* Top half: image and tags */}
      <div
        className="h-[35%] relative bg-gradient-to-br from-purple-100 via-blue-100 to-blue-100"
      >
      
        <div className="absolute top-2 right-4">
          <img src={image} alt={"logo"} className="w-16 h-16 rounded-md shadow-lg bg-white p-1" />
        </div>
      </div>

      {/* Bottom half: content */}
      <div className="pt-8 px-3 pb-3 flex flex-col justify-between h-full">
        <div>
          <h3 className="font-semibold text-xl line-clamp-2">{title}</h3>
          <p className="text-md text-gray-500">{organizer}</p>
        </div>
        <div className="flex justify-between items-center text-sm mt-2 text-gray-600">
          {views ? (
            <span className="flex items-center gap-1">
              <Eye size={14} /> {views.toLocaleString()} Views
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Users size={14} /> {applied} Applied
            </span>
          )}
          <span className="text-blue-600 text-lg">↗</span>
        </div>
      </div>
    </div>
  );
};

export default CompetitionCard;
