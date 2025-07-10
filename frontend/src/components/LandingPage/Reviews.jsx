import React from 'react'
import ReviewCard from './ReviewCard';

const Reviews = () => {

  const userReviews = [
  {
    name: "Aarav Mehta",
    twitter: "@TrainerAarav",
    image: "/trainer1.png",
    review: "FitConnect has completely streamlined how I manage my training business. I can schedule sessions, handle client communication, and even host live classes — all from one place. It’s helped me grow my reach and focus more on coaching rather than juggling tools.",
  },
  {
    name: "Neha Sharma",
    twitter: "@neha_lifts",
    image: "/athelete.jpg",
    review: "Competing through FitConnect is such a thrill! The platform makes it super easy to discover and join real fitness events.",
  },
  {
    name: "Rahul Joshi",
    twitter: "@rahul_fit",
    image: "/teen.jpg",
    review: "Found a great coach on FitConnect. Workouts are fun and tailored — actually enjoy showing up now.",
  },
  {
    name: "Sneha Verma",
    twitter: "@sneha.wellness",
    image: "/adult1.jpg",
    review: "As a working mom, I love how FitConnect fits around my schedule. My coach tracks my goals and checks in weekly. Super motivating!",
  },
  {
    name: "Ramesh Kumar",
    twitter: "@active65plus",
    image: "/elder.jpg",
    review: "It’s hard to find senior-friendly fitness apps, but FitConnect really works for me. The trainers are patient, and I feel healthier already.",
  },
  {
    name: "Meera D’Souza",
    twitter: "@meera_trains",
    image: "/coach.jpg",
    review: "I’ve been able to grow my coaching business faster with FitConnect. The visibility and tools are a huge plus.",
  },
  {
    name: "Kabir Singh",
    twitter: "@kabirRuns",
    image: "/runner.jpg",
    review: "Competing and tracking my training in one place is awesome. FitConnect is built for serious athletes.",
  },
  {
    name: "Anaya Roy",
    twitter: "@anaya_fit",
    image: "/teen2.jpg",
    review: "I just like how fun and simple FitConnect is. It keeps me moving.",
  },
  {
    name: "Sunita Malhotra",
    twitter: "@fitmom_sunita",
    image: "/mom.jpg",
    review: "Yoga, routine, and support — all in one app. Love it!",
  },
];



  return (
    <div className="px-14 py-24 w-full flex flex-col  items-center h-[110vh] gap-y-12 " >

        <div className="flex flex-col items-center gap-y-4 w-[60%] text-center" >
          <h1 className="text-black font-bold text-5xl" >Loved by the community</h1>
          <p className="text-gray-500 w-[50%] text-lg " >
            Don't take our word for it - listen to what Vite community members have to say. 
          </p>
        </div>
        <div className="flex gap-x-6" >

          <div  className="flex flex-col gap-y-4 pt-">
            
            <ReviewCard 
            name={userReviews[0].name} 
            username={userReviews[0].twitter} 
            image={userReviews[0].image} 
            
            review={userReviews[0].review} 
            />
            
            <ReviewCard 
            name={userReviews[1].name} 
            username={userReviews[1].twitter} 
            image={userReviews[1].image} 
           
            review={userReviews[1].review} 
            />
             
             <ReviewCard 
            name={userReviews[2].name} 
            username={userReviews[2].twitter} 
            image={userReviews[2].image} 
           
            review={userReviews[2].review} 
            />

          </div>
          
          <div  className="flex flex-col gap-y-4">
            
             <ReviewCard 
            name={userReviews[3].name} 
            username={userReviews[3].twitter} 
            image={userReviews[3].image} 
           
            review={userReviews[3].review} 
            />
            
             <ReviewCard 
            name={userReviews[4].name} 
            username={userReviews[4].twitter} 
            image={userReviews[4].image} 
           
            review={userReviews[4].review} 
            />

            <ReviewCard 
            name={userReviews[5].name} 
            username={userReviews[5].twitter} 
            image={userReviews[5].image} 
            
            review={userReviews[5].review} 
            />

          </div>
          <div  className="flex flex-col gap-y-4">
               
            <ReviewCard 
            name={userReviews[6].name} 
            username={userReviews[6].twitter} 
            image={userReviews[6].image} 
            
            review={userReviews[6].review} 
            />
            <ReviewCard 
            name={userReviews[7].name} 
            username={userReviews[7].twitter} 
            image={userReviews[7].image} 
           
            review={userReviews[7].review} 
            />
            <ReviewCard 
            name={userReviews[8].name} 
            username={userReviews[8].twitter} 
            image={userReviews[8].image} 
          
            review={userReviews[8].review} 
            />
          </div>
        </div>
      </div>
  )
}

export default Reviews