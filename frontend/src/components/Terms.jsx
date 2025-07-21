import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-16 flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
          Terms & Conditions
        </h1>

        <p className="text-lg mb-4 leading-relaxed">
          These Terms & Conditions ("Terms") govern your use of the <span className="font-semibold text-blue-600">Fit-Connect</span> platform. By accessing or using our services, you agree to be bound by these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Use of the Platform</h2>
        <p className="text-base mb-4 leading-relaxed">
          You must be at least 13 years old to use Fit-Connect. You agree to provide accurate information and use the platform only for lawful purposes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">2. User Accounts</h2>
        <p className="text-base mb-4 leading-relaxed">
          You are responsible for maintaining the confidentiality of your account credentials. You are also responsible for all activities that occur under your account.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">3. Trainer and User Responsibilities</h2>
        <p className="text-base mb-4 leading-relaxed">
          Trainers are responsible for the quality of the sessions and accuracy of their profiles. Users must respect trainer guidelines and session terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Payments & Subscriptions</h2>
        <p className="text-base mb-4 leading-relaxed">
          All payments for sessions, events, or subscriptions are non-refundable unless explicitly stated. Users agree to the pricing and terms at the time of purchase.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">5. Content Ownership</h2>
        <p className="text-base mb-4 leading-relaxed">
          All content on the platform, including text, images, and logos, is the property of Fit-Connect. Unauthorized use or reproduction is prohibited.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">6. Termination</h2>
        <p className="text-base mb-4 leading-relaxed">
          We reserve the right to suspend or terminate your account if you violate any of these Terms or engage in harmful or fraudulent activity.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">7. Changes to Terms</h2>
        <p className="text-base mb-4 leading-relaxed">
          We may update these Terms from time to time. Continued use of the platform means you accept the revised Terms.
        </p>

        <p className="text-base mt-8 leading-relaxed">
          If you have any questions about these Terms, please contact us via the <span className="text-blue-600 font-medium">Contact Us</span> page.
        </p>
      </div>
    </div>
  );
};

export default Terms;
