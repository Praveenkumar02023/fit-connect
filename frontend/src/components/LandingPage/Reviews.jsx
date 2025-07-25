import React from "react";
import ReviewCard from "./ReviewCard";

const Reviews = () => {
  const userReviews = [
    {
      name: "Aarav Mehta",
      twitter: "@TrainerAarav",
      image: "/trainer1.png",
      review:
        "FitConnect has completely streamlined how I manage my training business. I can schedule sessions, handle client communication, and even host live classes — all from one place. It’s helped me grow my reach and focus more on coaching rather than juggling tools.",
    },
    {
      name: "Neha Sharma",
      twitter: "@neha_lifts",
      image: "/athelete.jpg",
      review:
        "Competing through FitConnect is such a thrill! The platform makes it super easy to discover and join real fitness events.",
    },
    {
      name: "Rahul Joshi",
      twitter: "@rahul_fit",
      image: "/teen.jpg",
      review:
        "Found a great coach on FitConnect. Workouts are fun and tailored — actually enjoy showing up now.",
    },
    {
      name: "Sneha Verma",
      twitter: "@sneha.wellness",
      image: "/adult1.jpg",
      review:
        "As a working mom, I love how FitConnect fits around my schedule. My coach tracks my goals and checks in weekly. Super motivating!",
    },
    {
      name: "Ramesh Kumar",
      twitter: "@active65plus",
      image: "/elder.jpg",
      review:
        "It’s hard to find senior-friendly fitness apps, but FitConnect really works for me. The trainers are patient, and I feel healthier already.",
    },
    {
      name: "Meera D’Souza",
      twitter: "@meera_trains",
      image: "/coach.jpg",
      review:
        "I’ve been able to grow my coaching business faster with FitConnect. The visibility and tools are a huge plus.",
    },
    {
      name: "Kabir Singh",
      twitter: "@kabirRuns",
      image: "/runner.jpg",
      review:
        "Competing and tracking my training in one place is awesome. FitConnect is built for serious athletes.",
    },
    {
      name: "Anaya Roy",
      twitter: "@anaya_fit",
      image: "/teen2.jpg",
      review:
        "I just like how fun and simple FitConnect is. It keeps me moving.",
    },
    {
      name: "Sunita Malhotra",
      twitter: "@fitmom_sunita",
      image: "/mom.jpg",
      review:
        "Yoga, routine, and support — all in one app. Love it!",
    },
  ];

  return (
    <div className="relative px-4 md:px-14 py-24 w-full flex flex-col items-center gap-y-12">
      {/* Background Blurs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 blur-3xl h-60 w-60 md:h-96 md:w-96 bg-pink-100 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 blur-3xl h-60 w-60 md:h-96 md:w-96 bg-yellow-100 rounded-full animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative flex flex-col items-center gap-y-4 w-full md:w-[60%] text-center">
        <h1 className="text-black font-bold text-3xl md:text-5xl">
          Loved by the community
        </h1>
        <p className="text-gray-500 text-base md:text-lg w-full md:w-[60%]">
          Don't take our word for it — listen to what FitConnect community members have to say.
        </p>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userReviews.map((review, index) => (
          <ReviewCard
            key={index}
            name={review.name}
            username={review.twitter}
            image={review.image}
            review={review.review}
          />
        ))}
      </div>
    </div>
  );
};

export default Reviews;
