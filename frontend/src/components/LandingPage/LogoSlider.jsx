import React from 'react'

const LogoSlider = () => {
    
    const companyLogos = [
        "/puma.png",
        "/nike.png",
        "/adidas.png",
        "/cult.png",
        "/optimum_.png",
        "/birla.png",
        "/dec.png",
        "/myFitness.png"
    ]
    
    return (
    <div className='flex mt-12 justify-center bg-gray-100 py-6 overflow-hidden' >
        <h3 className="text-center text-gray-700 font-medium text-lg mb-4">
        Industry veterans <span className="text-blue-600 font-semibold">Trust us</span>
      </h3>
      <div className="flex items-center relative w-full overflow-hidden">
        <div className="flex items-center animate-marquee space-x-16 w-max">
          {companyLogos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Company ${i}`}
              className="h-15 w-auto object-contain"
            />
          ))}
          {/* Duplicate logos for seamless looping */}
          {companyLogos.map((src, i) => (
            <img
              key={`clone-${i}`}
              src={src}
              alt={`Company ${i}`}
              className="h-15 w-auto object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LogoSlider