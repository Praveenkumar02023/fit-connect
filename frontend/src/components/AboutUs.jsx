import React from "react";
import Footer from "./LandingPage/Footer";

const AboutUs = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-orange-50">
      {/* Bubble Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-[200px] right-[300px] w-96 h-96 bg-violet-300 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-[50%] left-[20%] w-80 h-80 bg-orange-200 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[300px] left-[-60px] w-72 h-72 bg-lime-200 rounded-full blur-[100px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[120px] left-[40%] w-96 h-96 bg-indigo-200 rounded-full blur-[120px] opacity-30 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
          About Us
        </h1>
        <p className="text-lg mb-4 leading-relaxed text-center sm:text-left">
          Welcome to <span className="font-semibold text-blue-600">Fit-Connect</span> — a platform dedicated to making fitness simple, personal, and accessible.
          Our mission is to help users connect with experienced trainers, join exciting fitness events, and achieve their health goals in a supportive environment.
        </p>
        <p className="text-lg mb-4 leading-relaxed text-center sm:text-left">
          Whether you're looking to build strength, improve endurance, or stay consistent with your workouts,
          Fit-Connect offers a space where both users and trainers can thrive.
        </p>
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 text-center sm:text-left">
          Our Mission
        </h2>
        <p className="text-lg leading-relaxed text-center sm:text-left">
          To simplify the way people access fitness guidance by connecting them with the right trainers, tools, and community support.
        </p>
      </div>

      {/* Footer outside content for scrolling */}
      <Footer />
    </div>
  );
};

export default AboutUs;
