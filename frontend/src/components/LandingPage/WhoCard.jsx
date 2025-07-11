import React from 'react';

const WhoCard = ({ title, description, image }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-white w-full max-w-md">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      {image && (
        <img 
          src={image}
          alt="Card visual"
          className="my-2  w-20 h-27 object-cover rounded-lg ml-4"
        />
      )}
    </div>
  );
};

export default WhoCard;
