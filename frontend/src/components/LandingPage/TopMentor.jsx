import { ArrowLeft, ArrowRight } from "lucide-react";
import MentorCard from "./MentorCard";
import { useRef } from "react";
const mentors = [
  {
    name: "Aarav Mehta",
    image: "/mentor1.jpg",
    role: "Certified Strength Coach @Gold's Gym | 10+ Years Experience ",
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
  const CARD_WIDTH = 270;

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -CARD_WIDTH : CARD_WIDTH,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="pt-48 px-14 py-10 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 w-full ">
        <div className="flex flex-col items-center w-full ">
          <h2 className="text-4xl font-bold">
            <span className="text-blue-700">Top</span> Mentors
          </h2>
          <p className="text-md text-gray-500">
            In search of excellence? Explore the highest-rated mentors as
            recognized by the community.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="px-12">
          <ArrowLeft
            onClick={() => scroll("left")}
            className="border rounded-full cursor-pointer hover:border-gray-200 hover:bg-gray-100"
          />
        </div>

        {/* Cards Scroll */}
        <div
          ref={scrollRef}
          className="flex py-4 overflow-x-auto scroll-smooth gap-4 no-scrollbar"
        >
          {mentors.map((mentor, i) => (
            <MentorCard key={i} {...mentor} />
          ))}
        </div>

        <div className="px-12">
          <ArrowRight
            onClick={() => scroll("right")}
            className="border rounded-full cursor-pointer hover:border-gray-200 hover:bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default TopMentor;
