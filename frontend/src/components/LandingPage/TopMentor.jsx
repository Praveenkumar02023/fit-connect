import React, { useEffect, useRef } from "react";
import MentorCard from "./MentorCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

const mentors = [
  {
    name: "Aarav Mehta",
    image: "/mentor1.jpg",
    role: "Certified Strength Coach @Gold's Gym | 10+ Years Experience",
    rating: "4.9",
  },
  {
    name: "Noor Rehman",
    image: "/mentor2.jpg",
    role: "Fitness Nutrition Specialist | Ex-CultFit | 5k+ Online Clients",
    rating: "4.8",
  },
  {
    name: "Kabir Singh",
    image: "/mentor4.jpg",
    role: "National-Level Sprinter | Strength & Conditioning Coach",
    rating: "4.9",
  },
  {
    name: "Sunita Malhotra",
    image: "/mentor3.jpg",
    role: "Certified Yoga Instructor | 12+ Years | Senior Wellness Specialist",
    rating: "4.9",
  },
  {
    name: "Rohan Desai",
    image: "/mentor5.jpg",
    role: "CrossFit Level 2 Trainer | Ex-Reebok Coach | Specializes in HIIT",
    rating: "4.7",
  },
  {
    name: "Ishita Kapoor",
    image: "/mentor6.jpg",
    role: "Body Transformation Coach | 300+ Clients Trained | NASM Certified",
    rating: "4.8",
  },
  {
    name: "Ankit Rawal",
    image: "/mentor7.jpg",
    role: "Rehab & Mobility Expert | Ex-Sports Physio | 8+ Years Experience",
    rating: "4.9",
  },
  {
    name: "Pooja Iyer",
    image: "/mentor8.jpg",
    role: "Functional Fitness Coach | Kettlebell Specialist | Online Bootcamp Host",
    rating: "4.8",
  },
];

const TopMentor = () => {
  const scrollRef = useRef(null);

  // Duplicate mentors list many times for smooth infinite scroll
  const bigList = new Array(40).fill(mentors).flat();

  const CARD_WIDTH = 280; // same as before

  const scrollByArrow = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -CARD_WIDTH : CARD_WIDTH,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const box = scrollRef.current;

    const handleScroll = () => {
      const max = box.scrollWidth - box.clientWidth;

      // If user scrolls too far right → shift slightly left
      if (box.scrollLeft > max * 0.8) {
        box.style.scrollBehavior = "auto";
        box.scrollLeft = max * 0.2;
        box.style.scrollBehavior = "smooth";
      }

      // If user scrolls too far left → shift slightly right
      if (box.scrollLeft < max * 0.2) {
        box.style.scrollBehavior = "auto";
        box.scrollLeft = max * 0.8;
        box.style.scrollBehavior = "smooth";
      }
    };

    box.addEventListener("scroll", handleScroll);
    return () => box.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pt-24 px-4 md:px-14 py-10 w-full">

      {/* Header */}
      <div className="flex flex-col items-center text-center w-full mb-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-blue-700">Top</span> Mentors
        </h2>
        <p className="text-sm md:text-md text-gray-500 mt-2">
          In search of excellence? Explore the highest-rated mentors.
        </p>
      </div>

      {/* Scroll Row */}
      <div className="flex justify-center items-center gap-2 md:gap-6">
        <ArrowLeft
          onClick={() => scrollByArrow("left")}
          className="hidden sm:block border rounded-full cursor-pointer hover:border-gray-200 hover:bg-gray-100"
        />

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth gap-4 no-scrollbar px-2"
        >
          {bigList.map((mentor, i) => (
            <MentorCard
              key={i}
              name={mentor.name}
              image={mentor.image}
              role={mentor.role}
              rating={mentor.rating}
            />
          ))}
        </div>

        <ArrowRight
          onClick={() => scrollByArrow("right")}
          className="hidden sm:block border rounded-full cursor-pointer hover:border-gray-200 hover:bg-gray-100"
        />
      </div>
    </div>
  );
};

export default TopMentor;
