import React from 'react';

const FeatureCard = ({ title, subtitle, bgColor, image }) => {
  return (
    <div className={`cursor-pointer hover:-translate-y-2 transition-transform duration-300   rounded-2xl shadow-md px-4 text-white ${bgColor} w-[16vw] h-[140px] flex  justify-between`}>
      <div className=' pt-8 flex flex-col' >
        <h2 className="text-xl text-gray-700 font-semibold">{title}</h2>
        <p className="text-sm font-semibold text-gray-500 mt-1">{subtitle}</p>
      </div>
      <img src={image} alt={title} className="w-48 h-34 self-end" />
    </div>
  );
};

export default FeatureCard;
