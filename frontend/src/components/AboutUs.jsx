import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
          About Us
        </h1>
        <p className="text-lg mb-4 leading-relaxed">
          Welcome to <span className="font-semibold text-blue-600">Fit-Connect</span> — a platform dedicated to making fitness simple, personal, and accessible. 
          Our mission is to help users connect with experienced trainers, join exciting fitness events, and achieve their health goals in a supportive environment.
        </p>
        <p className="text-lg mb-4 leading-relaxed">
          Whether you're looking to build strength, improve endurance, or stay consistent with your workouts, 
          Fit-Connect offers a space where both users and trainers can thrive.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">Our Mission</h2>
        <p className="text-lg leading-relaxed">
          To simplify the way people access fitness guidance by connecting them with the right trainers, tools, and community support.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
