import React from "react";
import Footer from "./LandingPage/Footer";

const Policy = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-orange-50 text-gray-800 flex flex-col items-center pt-12 pb-24 px-4">
      {/* Bubble Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-[200px] right-[300px] w-96 h-96 bg-violet-300 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-[50%] left-[20%] w-80 h-80 bg-orange-200 rounded-full blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[300px] left-[-60px] w-72 h-72 bg-lime-200 rounded-full blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[120px] left-[40%] w-96 h-96 bg-indigo-200 rounded-full blur-[120px] opacity-20 animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
          Privacy Policy
        </h1>

        <p className="text-lg mb-4 leading-relaxed">
          At <span className="font-semibold text-blue-600">Fit-Connect</span>, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
        <p className="text-base mb-4 leading-relaxed">
          We may collect personal details such as your name, email, contact number, fitness preferences, and other relevant data when you sign up or use our services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
        <p className="text-base mb-4 leading-relaxed">
          The information we collect is used to provide and improve our services, personalize your experience, and communicate with you about updates, events, or support.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">3. Data Sharing</h2>
        <p className="text-base mb-4 leading-relaxed">
          We do not sell or rent your data to third parties. We may share your information with trusted service providers who assist in operating our platform, under strict confidentiality agreements.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Data Security</h2>
        <p className="text-base mb-4 leading-relaxed">
          We implement industry-standard measures to secure your data from unauthorized access, alteration, or disclosure.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">5. Your Rights</h2>
        <p className="text-base mb-4 leading-relaxed">
          You have the right to access, modify, or delete your personal information. You can do this through your account settings or by contacting us directly.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">6. Updates to This Policy</h2>
        <p className="text-base mb-4 leading-relaxed">
          We may update this Privacy Policy from time to time. Any changes will be reflected on this page with a revised date.
        </p>

        <p className="text-base mt-8 leading-relaxed">
          If you have any questions or concerns regarding this policy, feel free to contact us through our <span className="text-blue-600 font-medium">Contact Us</span> page.
        </p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Policy;
