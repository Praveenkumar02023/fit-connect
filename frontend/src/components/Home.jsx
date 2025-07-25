import { Plus, Shell, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import NavbarLink from './LandingPage/TextComponent.jsx';
import Button from "./ui/Button.jsx";
import FeatureCard from "./LandingPage/featureCard.jsx";
import WhoCard from "./LandingPage/WhoCard.jsx";
import LogoSlider from "./LandingPage/LogoSlider.jsx";
import Reviews from "./LandingPage/Reviews.jsx";
import TopMentor from "./LandingPage/TopMentor.jsx";
import TopCompetition from "./LandingPage/TopCompetetion.jsx";
import CallToAction from "./LandingPage/CallToAction.jsx";
import Footer from "./LandingPage/Footer.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-bl from-violet-200 via-blue-100 to-cyan-200 relative overflow-hidden">

      {/* Decorative Blur Bubbles */}
      <div className="absolute inset-0  pointer-events-none">
        <div className="absolute top-28 left-16 h-72 w-72 bg-blue-300 opacity-80 blur-3xl rounded-full animate-pulse" />
        {/* <div className="absolute top-[450px] left-[10%] h-[350px] w-[350px] bg-blue-400 opacity-75 blur-3xl rounded-full animate-pulse" /> */}
        <div className="absolute top-[600px] right-16 h-80 w-80 bg-pink-300 opacity-80 blur-3xl rounded-full animate-pulse" />
        <div className="absolute top-[1100px] left-10 h-64 w-64 bg-purple-300 opacity-70 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-10 h-[300px] w-[300px] bg-orange-200 opacity-70 blur-3xl rounded-full animate-pulse" />
      </div>

      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 md:px-14 items-center h-16 w-full border-b border-gray-400 flex justify-between">
        <div className="flex items-center text-black font-bold text-xl md:text-2xl">
          <Shell />
          <h1 className="ml-1">FitConnect</h1>
        </div>
        <div className="hidden md:flex gap-x-2 items-center">
          <div className="flex gap-x-4">
            <NavbarLink text={" Competitions "} to={"/signin"} />
            <NavbarLink text={" Trainers "} to={"/signin"} />
            <NavbarLink text={" About Us "} to={"/about"} />
          </div>
          <div className="h-full px-6 border-x border-gray-400">
            <Button
              size="md"
              className="transform transition hover:scale-105 rounded-full text-md font-semibold px-6 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Login
            </Button>
          </div>
          <Button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-500 text-gray-600 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-600 transition hover:scale-105 text-sm font-semibold"
            size="md"
            variant="outline"
            onClick={() => navigate("/event/create")}
          >
            <Plus size={18} />
            Host
          </Button>
        </div>
        <div className="md:hidden">
          {mobileMenuOpen ? (
            <X size={28} onClick={() => setMobileMenuOpen(false)} />
          ) : (
            <Menu size={28} onClick={() => setMobileMenuOpen(true)} />
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white border-b border-gray-300 px-6 py-4 z-40 flex flex-col md:hidden gap-2">
          <NavbarLink text={" Competitions "} to={"/signin"} />
          <NavbarLink text={" Trainers "} to={"/signin"} />
          <NavbarLink text={" About Us "} to={"/about"} />
          <Button
            className="w-full mt-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/signin");
            }}
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="w-full text-sm font-semibold mt-1 flex items-center justify-center gap-2"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/event/create");
            }}
          >
            <Plus size={18} />
            Host
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative py-20 px-4 md:px-[10%] w-full flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Text */}
        <div className="relative w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-blue-700">Unlock</span> Your Fitness
          </h1>
          <p className="text-gray-600 text-base md:text-lg mt-4 max-w-md">
            Train. Transform. Compete. FitConnect connects top trainers, goal-driven clients, and world-class fitness events.
          </p>
        </div>

        {/* Right Feature Cards */}
        <div className="relative w-full lg:w-[50%] grid grid-cols-2 gap-4 p-2 sm:p-6">
          <FeatureCard
            title={"Trainers"}
            subtitle={"Training From Top Trainers."}
            bgColor={"bg-violet-300/80"}
            image={"/trainer.png"}
          />
          <FeatureCard
            title={"Competitions"}
            subtitle={"Compete With Athletes."}
            bgColor={"bg-green-300/80"}
            image={"compete.png"}
          />
          <FeatureCard
            title={"Prizes"}
            subtitle={"Win By Competing."}
            bgColor={"bg-yellow-300/80"}
            image={"/trophy.png"}
          />
          <FeatureCard
            title={"Nutrition"}
            subtitle={"Diets From Certified Experts."}
            bgColor={"bg-blue-300/80"}
            image={"/diet.png"}
          />
        </div>
      </div>

      {/* Who Cards */}
      <div className="relative px-4 md:px-14 w-full mt-4">
        <h1 className="text-lg font-semibold text-black mb-4">Who's using FitConnect?</h1>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-x-4 sm:gap-y-0">
          <WhoCard
            title={"Fitness Trainers"}
            description={"Grow your brand, manage clients, and host training sessions effortlessly."}
            image={"/whoTrainer.png"}
          />
          <WhoCard
            title={"All Age Groups"}
            description={"From teens to elders — FitConnect empowers every generation to stay fit, healthy, and engaged."}
            image={"/elder.png"}
          />
          <WhoCard
            title={"Athletes"}
            description={"Participate in intense competitions, track performance, and win exciting rewards."}
            image={"/athelte.png"}
          />
        </div>
      </div>

      {/* Remaining Sections */}
      <LogoSlider />
      <Reviews />
      <TopMentor />
      <TopCompetition />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
