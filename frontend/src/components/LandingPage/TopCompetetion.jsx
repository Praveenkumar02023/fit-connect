import React, { useRef } from "react";
import CompetitionCard from "./CompetitionCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

const competitions = [
  {
    title: "Urban Marathon Sprint",
    organizer: "Nike",
    views: 953,
    image: "/nike.png",
  },
  {
    title: "Endurance Cycling Race",
    organizer: "Puma",
    views: 17592,
    image: "/puma.png",
  },
  {
    title: "FitZone Swimming Challenge",
    organizer: "Adidas",
    views: 22852,
    image: "/adidas.png",
  },
  {
    title: "Functional Fitness Throwdown",
    organizer: "Cult Fit",
    applied: 31,
    image: "/cult.png",
  },
  {
    title: "IronFit Weightlifting Cup",
    organizer: "Optimum Nutrition",
    views: 12320,
    image: "/optimum_.png",
  },
  {
    title: "National Yoga Retreat",
    organizer: "Adidas",
    views: 7601,
    image: "/adidas.png",
  },
  {
    title: "CrossFit Power Games",
    organizer: "MyFitness",
    views: 8945,
    image: "/myFitness.png",
  },
  {
    title: "Trail Run Challenge",
    organizer: "Decathalon",
    views: 18243,
    image: "/dec.png",
  },
];

const TopCompetition = () => {
  const scrollRef = useRef(null);
  const CARD_WIDTH = 290;

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -CARD_WIDTH : CARD_WIDTH,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative pt-18 px-14 py-10 w-full">

      <div className="inset-0 absolute" >
         <div className=" absolute top-30 blur-3xl left-25 h-96 w-96 bg-green-100  rounded-full animate-pulse"></div>
          <div className=" absolute  blur-3xl right-25 h-96 w-96 bg-violet-200  rounded-full animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 w-full ">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-4xl font-bold">
            <span className="text-blue-700">Top</span> Competitions
          </h2>
          <p className="text-md text-gray-500">
            Explore the Competitions that are creating a buzz among your peers!
          </p>
        </div>
      </div>

      {/* Arrow + Scroll Section */}
      <div className="relative flex justify-center items-center">
        {/* Left Arrow */}
        <div className="px-12">
          <ArrowLeft
            onClick={() => scroll("left")}
            className="relative border rounded-full cursor-pointer hover:border-gray-400 hover:bg-gray-100"
          />
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="py-4 relative flex overflow-x-auto scroll-smooth gap-4 no-scrollbar"
        >
          {competitions.map((comp, i) => (
            <CompetitionCard key={i} {...comp} />
          ))}
        </div>

        {/* Right Arrow */}
        <div className="px-12">
          <ArrowRight
            onClick={() => scroll("right")}
            className="relative border rounded-full cursor-pointer hover:border-gray-200 hover:bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default TopCompetition;
