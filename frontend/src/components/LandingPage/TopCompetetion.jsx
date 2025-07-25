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
    views: 3198,
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
    organizer: "Decathlon",
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
    <div className="relative pt-24 px-4 md:px-14 py-10 w-full">
      {/* Background Bubbles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 blur-3xl left-10 h-60 w-60 md:h-96 md:w-96 bg-green-100 rounded-full animate-pulse"></div>
        <div className="absolute bottom-5 blur-3xl right-10 h-60 w-60 md:h-96 md:w-96 bg-violet-200 rounded-full animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center text-center w-full mb-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-blue-700">Top</span> Competitions
        </h2>
        <p className="text-sm md:text-md text-gray-500 mt-2">
          Explore the Competitions that are creating a buzz among your peers!
        </p>
      </div>

      {/* Scrollable Competition Cards */}
      <div className="flex justify-center items-center gap-2 md:gap-6">
        <ArrowLeft
          onClick={() => scroll("left")}
          className="hidden sm:block border rounded-full cursor-pointer hover:border-gray-200 hover:bg-gray-100"
        />
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth gap-4 no-scrollbar px-2"
        >
          {competitions.map((comp, i) => (
            <CompetitionCard
              key={i}
              title={comp.title}
              organizer={comp.organizer}
              views={comp.views}
              image={comp.image}
            />
          ))}
        </div>
        <ArrowRight
          onClick={() => scroll("right")}
          className="hidden sm:block border rounded-full cursor-pointer hover:border-gray-200 hover:bg-gray-100"
        />
      </div>
    </div>
  );
};

export default TopCompetition;
