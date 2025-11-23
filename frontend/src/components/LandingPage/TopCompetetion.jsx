import { useEffect, useRef } from "react";

const competitions = [
  { 
    title: "Urban Sprint Run",
    organizer: "Nike",
    views: 953,
    image: "/nike.png"
  },
  { 
    title: "Endurance Cycle Tour",
    organizer: "Puma",
    views: 17592,
    image: "/puma.png"
  },
  { 
    title: "Elite Swim Meet",
    organizer: "Adidas",
    views: 22852,
    image: "/adidas.png"
  },
  { 
    title: "Strength Fitness Cup",
    organizer: "Cult Fit",
    views: 3198,
    image: "/cult.png"
  },
  { 
    title: "IronFit Lift Contest",
    organizer: "Optimum Nutrition",
    views: 12320,
    image: "/optimum_.png"
  },
  { 
    title: "National Yoga Camp",
    organizer: "Adidas",
    views: 7601,
    image: "/adidas.png"
  },
  { 
    title: "CrossFit Power Cup",
    organizer: "MyFitness",
    views: 8945,
    image: "/myFitness.png"
  },
  { 
    title: "Trail Run Series",
    organizer: "Decathlon",
    views: 18243,
    image: "/dec.png"
  }
];


export default function TopCompetition() {
  const containerRef = useRef(null);

  // Duplicate data 50 times for smooth infinite scroll
  const bigList = new Array(50).fill(competitions).flat();

  useEffect(() => {
    const box = containerRef.current;

    const handleScroll = () => {
      const max = box.scrollWidth - box.clientWidth;

      // When user scrolls too far right → reset to middle without jump
      if (box.scrollLeft > max * 0.8) {
        box.style.scrollBehavior = "auto";
        box.scrollLeft = max * 0.2;
        box.style.scrollBehavior = "smooth";
      }

      // When user scrolls too far left → reset to middle
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
    <div className="w-full py-12 px-8 md:px-14">

      {/* Header */}
      <div className="flex flex-col items-center text-center w-full mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-blue-700">Top</span> Competitions
        </h2>
        <p className="text-sm md:text-md text-gray-500 mt-2">
          Explore the Competitions that are creating a buzz among your peers!
        </p>
      </div>

      {/* Infinite Scroller */}
      <div
        ref={containerRef}
        className="w-full overflow-x-scroll whitespace-nowrap scroll-smooth no-scrollbar"
      >
        {bigList.map((c, i) => (
          <div
            key={i}
            className="inline-block w-[260px] h-[180px] bg-white shadow-md rounded-xl m-3 
                       flex flex-col justify-between p-4"
          >
            <img
              src={c.image}
              className="h-12 mx-auto object-contain"
              alt={c.title}
            />

            <div className="text-center">
              <p className="text-lg font-bold">{c.title}</p>
              <p className="text-gray-500 text-sm">{c.organizer}</p>
            </div>

            <p className="text-sm font-semibold text-center">{c.views} views</p>
          </div>
        ))}
      </div>
    </div>
  );
}
