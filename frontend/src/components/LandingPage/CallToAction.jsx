import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <div className="relative w-screen px-14" >
        <section className="bg-gradient-to-r from-indigo-900 via-blue-600 to-pink-900 text-white py-16 text-center rounded-2xl shadow-lg mt-16">
      <h2 className="text-4xl font-bold mb-4">Level Up Your Fitness Journey with FitMan</h2>
      <p className="text-lg mb-8 max-w-2xl mx-auto">
        Whether you're a trainer looking to grow or a fitness enthusiast ready to transform, FitMan gives you the tools to connect, train, and thrive.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <button className="bg-white text-blue-700 hover:bg-blue-100 font-semibold py-3 px-6 rounded-full flex items-center gap-2 transition hover:scale-105 cursor-pointer">
          Join as a Trainer <ArrowRight className="w-4 h-4" />
        </button>
        <button className="bg-black bg-opacity-20 hover:bg-opacity-40 font-semibold py-3 px-6 rounded-full flex items-center gap-2 transition hover:scale-105 cursor-pointer">
          Explore Events & Trainers <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
    </div>
  );
};

export default CallToAction;
