import React from "react";

const LogoSlider = () => {
  const companyLogos = [
    "/puma.png",
    "/nike.png",
    "/adidas.png",
    "/cult.png",
    "/optimum_.png",
    "/birla.png",
    "/dec.png",
    "/myFitness.png",
  ];

  return (
    <div className="flex flex-col items-center mt-12 bg-gray-100 py-6 overflow-hidden px-4">
      <h3 className="text-center text-gray-700 font-medium text-lg mb-4">
        Industry veterans <span className="text-blue-600 font-semibold">Trust us</span>
      </h3>
      <div className="w-full overflow-hidden">
        <div className="flex items-center animate-marquee space-x-10 sm:space-x-16 w-max">
          {companyLogos.concat(companyLogos).map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Company ${i}`}
              className="h-10 sm:h-14 w-auto object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSlider;