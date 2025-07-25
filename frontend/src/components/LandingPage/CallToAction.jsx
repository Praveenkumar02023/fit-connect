import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full px-4 md:px-14">
      <section className="bg-gradient-to-r from-indigo-900 via-blue-600 to-pink-900 text-white py-12 md:py-16 text-center rounded-2xl shadow-lg mt-16">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Level Up Your Fitness Journey with FitConnect
        </h2>
        <p className="text-sm md:text-lg mb-8 max-w-xl md:max-w-2xl mx-auto px-4 md:px-0">
          Whether you're a trainer looking to grow or a fitness enthusiast ready to transform,
          FitConnect gives you the tools to connect, train, and thrive.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap px-4">
          <button
            onClick={() => navigate("/signin/trainer")}
            className="bg-white text-blue-700 hover:bg-blue-100 font-semibold py-2.5 px-5 sm:py-3 sm:px-6 rounded-full flex items-center justify-center gap-2 transition hover:scale-105 cursor-pointer"
          >
            Join as a Trainer <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/signin/user")}
            className="bg-black bg-opacity-20 hover:bg-opacity-40 font-semibold py-2.5 px-5 sm:py-3 sm:px-6 rounded-full flex items-center justify-center gap-2 transition hover:scale-105 cursor-pointer"
          >
            Explore Events & Trainers <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default CallToAction;
