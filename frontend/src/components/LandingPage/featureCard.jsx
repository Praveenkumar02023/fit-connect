const FeatureCard = ({ title, subtitle, bgColor, image }) => {
  return (
    <div className={`rounded-2xl shadow-md p-4 ${bgColor} w-full sm:w-48 md:w-60 flex flex-col items-center gap-2`}>
      <img
        src={image}
        alt={title}
        className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
      />
      <h3 className="font-semibold text-center text-base sm:text-lg">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-700 text-center">{subtitle}</p>
    </div>
  );
};

export default FeatureCard;