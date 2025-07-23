import React from "react";
import Footer from "./LandingPage/Footer";

const Contact = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-orange-50 text-gray-800 flex flex-col items-center pt-12  ">
      {/* Bubble Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-[200px] right-[300px] w-96 h-96 bg-violet-300 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-[50%] left-[20%] w-80 h-80 bg-orange-200 rounded-full blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[300px] left-[-60px] w-72 h-72 bg-lime-200 rounded-full blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[120px] left-[40%] w-96 h-96 bg-indigo-200 rounded-full blur-[120px] opacity-20 animate-pulse" />
      </div>

      {/* Main Content */}
      <div className=" px-4 relative z-10 w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
          Contact Us
        </h1>
        <p className="text-lg mb-8 text-center">
          Have questions, feedback, or just want to say hello? We'd love to hear from you.
        </p>

        {/* Contact Card */}
        <div className=" bg-gray-50 border border-gray-300 shadow-lg rounded-xl p-8 space-y-6">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your message..."
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
