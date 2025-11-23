import React, { useRef, useEffect } from "react";
import ReviewCard from "./ReviewCard";

const Reviews = () => {
  const scrollRef = useRef(null);

  const userReviews = [
    { name: "Aarav Mehta", twitter: "@TrainerAarav", image: "/trainer1.png", review: "FitConnect has completely streamlined how I manage my training business. Scheduling, communication, and live classes — all in one place." },
    { name: "Neha Sharma", twitter: "@neha_lifts", image: "/athelete.jpg", review: "Competing through FitConnect is a thrill! Super easy to discover and join fitness events." },
    { name: "Rahul Joshi", twitter: "@rahul_fit", image: "/teen.jpg", review: "Found an amazing coach. Workouts are fun and personalized — I actually enjoy training." },
    { name: "Sneha Verma", twitter: "@sneha.wellness", image: "/adult1.jpg", review: "FitConnect fits perfectly into my schedule. Weekly check-ins keep me motivated!" },
    { name: "Ramesh Kumar", twitter: "@active65plus", image: "/elder.jpg", review: "A great fitness platform for seniors. Trainers are patient and helpful." },
    { name: "Meera D’Souza", twitter: "@meera_trains", image: "/coach.jpg", review: "My coaching business grew faster with FitConnect’s tools and visibility." },
    { name: "Kabir Singh", twitter: "@kabirRuns", image: "/runner.jpg", review: "Tracking training + competitions in one place is awesome." },
    { name: "Anaya Roy", twitter: "@anaya_fit", image: "/teen2.jpg", review: "So simple and fun to use! It keeps me active." },
    { name: "Sunita Malhotra", twitter: "@fitmom_sunita", image: "/mom.jpg", review: "Yoga, routine, and guidance — all in one smooth app." },
  ];

  const bigList = new Array(20).fill(userReviews).flat();

  useEffect(() => {
    const box = scrollRef.current;

    const max = box.scrollWidth - box.clientWidth;

    box.scrollLeft = max / 2;

    const smoothLoop = () => {
      if (box.scrollLeft >= max * 0.9) box.scrollLeft = max * 0.45;
      if (box.scrollLeft <= max * 0.1) box.scrollLeft = max * 0.55;
    };

    box.addEventListener("scroll", smoothLoop);

    return () => box.removeEventListener("scroll", smoothLoop);
  }, []);

  return (
    <div className="relative px-4 md:px-14 py-14 w-full flex flex-col items-center gap-y-12">

      <div className="text-center w-full md:w-[60%]">
        <h1 className="text-black font-bold text-3xl md:text-5xl">
          Loved by the community
        </h1>
        <p className="text-gray-500 text-base md:text-lg mt-2">
          Don't take our word — hear what the FitConnect community says.
        </p>
      </div>

      {/* SCROLL AREA */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-scroll whitespace-nowrap no-scrollbar py-6 scroll-smooth"
      >
        {bigList.map((review, index) => (
          <div key={index} className="inline-block mr-6">
            <ReviewCard {...review} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
