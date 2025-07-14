import { useContext, useEffect, useState } from "react";
import axios from 'axios'
import { StoreContext } from "../Context/StoreContext";

const trainers = [
  {
    id: 1,
    name: "Sarah Johnson",
    speciality: "Yoga & Meditation",
    rating: 4.9,
    students: 2400,
    featured: true,
  },
  {
    id: 2,
    name: "Mike Chen",
    speciality: "Strength Training",
    rating: 4.8,
    students: 1800,
    featured: false,
  },
  {
    id: 3,
    name: "Emma Wilson",
    speciality: "HIIT & Cardio",
    rating: 4.9,
    students: 3200,
    featured: true,
  },
  {
    id: 4,
    name: "David Rodriguez",
    speciality: "Pilates",
    rating: 4.7,
    students: 1500,
    featured: false,
  },
];

const sessions = [
  {
    id: 1,
    title: "Morning Power Yoga",
    trainer: "Sarah Johnson",
    level: "Beginner",
    duration: 30,
    joined: 145,
    trending: true,
  },
  {
    id: 2,
    title: "HIIT Blast",
    trainer: "Emma Wilson",
    level: "Intermediate",
    duration: 25,
    joined: 89,
    trending: true,
  },
  {
    id: 3,
    title: "Strength Builder",
    trainer: "Mike Chen",
    level: "Advanced",
    duration: 45,
    joined: 67,
    trending: false,
  },
  {
    id: 4,
    title: "Core Fusion",
    trainer: "David Rodriguez",
    level: "Intermediate",
    duration: 35,
    joined: 112,
    trending: true,
  },
];



const Feed = () => {
  const [event , setEvent] = useState([]);
  const {url,token} = useContext(StoreContext)

  useEffect(()=>{

    async function getEvents() {
      
      try {
        
        const res = await axios.get(`${url}/api/v1/event/all`,{
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        
        if(res.status != 200){
          return;
        }

        setEvent(res.data.allEvents);

      } catch (error) {
          console.log(error);
          
      }

    }

    getEvents();

  },[])


  return (
    <>
    <div className="h-screen flex flex-col bg-white">

    {/* Scrollable Main Content */}
    <main className="flex-1 overflow-y-auto min-h-0 p-6 space-y-8">
      {/* Featured Trainers */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">
            Featured Trainers
          </h2>
          <a href="/trainers" className="text-blue-600">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {trainers.map((t) => (
            <a
              key={t.id}
              href={`/trainers/${t.id}`}
              className="block border border-gray-300 p-4 rounded shadow hover:shadow-lg transition"
            >
              <div className="relative mb-4">
                {t.featured && (
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZcnsKC3iF9pB8_po80WXkn7h_3fd2bNx-Rq9T6B_mCx3IDZsdPjG8qNYt0pPC_YhJEA&usqp=CAU"
                  alt="Trainer Placeholder"
                  className="h-32 w-full object-cover rounded bg-gray-100"
                />
              </div>

              {/* <div className="h-32 bg-gray-200 mb-4"></div> */}
              <h3 className="font-semibold text-blue-600">{t.name}</h3>
              <p className="text-gray-700">{t.speciality}</p>
              {/* <p className="text-gray-700">⭐ {t.rating} · {t.students} students</p> */}
              <div className="flex justify-between items-center text-gray-700 text-sm mt-1">
                {/* Star Rating on the left */}
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#facc15"
                    viewBox="0 0 24 24"
                    stroke="none"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 17.25L18.52 21l-1.64-7.03L22 9.75l-7.19-.61L12 3 9.19 9.14 2 9.75l5.12 4.22L5.48 21 12 17.25z"
                    />
                  </svg>
                  <span>{t.rating}</span>
                </div>

                {/* Students on the right */}
                <div className="text-right text-sm text-gray-600">
                  {t.students} students
                </div>
              </div>

              <div className="mt-2 bg-blue-600 text-white text-center py-2 rounded">
                View Profile
              </div>
            </a>
          ))}
        </div>
       

      
      </section>

      {/* Trending Sessions */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">
            Trending Workout Sessions
          </h2>
          <a href="/sessions" className="text-blue-600">
            View All Sessions →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {sessions.map((s) => (
            <a
              key={s.id}
              href={`/sessions/${s.id}`}
              className="block border border-gray-300 p-4 rounded shadow hover:shadow-lg transition"
            >
             
              <div className="relative mb-5">
                {s.trending && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
                    {/* Trending icon with curve-up-right arrow */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 17L9 11L13 15L21 7" />
                      <path d="M14 7h7v7" />
                    </svg>
                    Trending
                  </span>
                )}

                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZcnsKC3iF9pB8_po80WXkn7h_3fd2bNx-Rq9T6B_mCx3IDZsdPjG8qNYt0pPC_YhJEA&usqp=CAU"
                  alt="Session Placeholder"
                  className="h-32 w-full object-cover rounded bg-gray-100"
                />
              </div>

             
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-gray-700">with {s.trainer}</p>
             

              <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
    ${
      s.level === "Beginner"
        ? "bg-green-200 text-green-800"
        : s.level === "Intermediate"
        ? "bg-yellow-200 text-yellow-800"
        : s.level === "Advanced"
        ? "bg-red-200 text-red-800"
        : ""
    }`}
                >
                  {s.level}
                </span>

                {/* Time with watch emoji */}
                <div className="flex items-center text-sm">
                  <span className="mr-1">
                    <img
                      src="https://img.myloview.com/posters/clock-without-numbers-blank-wall-clock-schematic-representation-of-a-clock-stock-image-eps-10-700-243070185.jpg"
                      alt="Session Placeholder"
                      height="20px"
                      width="20"
                    />
                  </span>
                  <span>{s.duration} min</span>
                </div>
              </div>

              {/* Joined count with people icon */}
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <span className="mr-1">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhMLyfAgodrq-MyrUeL0_81bDBqT7V2d7IGmOYWc9ZDFHPpgT1g0ygzG-x5w6Zn9a5f8g&usqp=CAU"
                    alt="Session Placeholder"
                    height="20px"
                    width="20"
                  />
                </span>
                <span>{s.joined} joined</span>
              </div>

              <div className="mt-2 bg-blue-600 text-white text-center py-2 rounded">
                Join Now
              </div>
            </a>
          ))}
        </div>
      </section>


    <section>
    <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-black">
      Featured Upcoming Events
    </h2>
    <a href="/events" className="text-blue-600">
      View All Events →
    </a>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {event.filter(e => e.status === "upcoming").map((event) => (
      <a
        key={event._id}
        href={`/event/${event._id}`}
        className="block border border-gray-300 p-4 rounded shadow hover:shadow-lg transition"
      >
        <div className="relative mb-4">
          {event.status === "upcoming" && (
            <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow">
              Upcoming
            </span>
          )}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZcnsKC3iF9pB8_po80WXkn7h_3fd2bNx-Rq9T6B_mCx3IDZsdPjG8qNYt0pPC_YhJEA&usqp=CAU"
            alt="Event"
            className="h-32 w-full object-cover rounded bg-gray-100"
          />
        </div>

        <h3 className="font-semibold text-blue-600">{event.title}</h3>
        <p className="text-gray-700 text-sm">{event.description}</p>
        <p className="text-gray-600 text-xs mt-1">
          📍 {event.location}
        </p>
        <p className="text-gray-600 text-xs mt-1">
          🏁 {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
        </p>
        <p className="text-gray-600 text-xs mt-1">
          🎁 Prize Pool: ₹{event.prizePool}
        </p>

        <div className="mt-3 bg-blue-600 text-white text-center py-2 rounded">
          Join Event
        </div>
      </a>
    ))}
  </div>
</section>

     <section>
    <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-black">
      Featured Ongoing Events
    </h2>
    <a href="/events" className="text-blue-600">
      View All Events →
    </a>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {event.filter(e => e.status === "ongoing").map((event) => (
      <a
        key={event._id}
        href={`/event/${event._id}`}
        className="block border border-gray-300 p-4 rounded shadow hover:shadow-lg transition"
      >
        <div className="relative mb-4">
          {event.status === "ongoing" && (
            <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow">
              Ongoing
            </span>
          )}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZcnsKC3iF9pB8_po80WXkn7h_3fd2bNx-Rq9T6B_mCx3IDZsdPjG8qNYt0pPC_YhJEA&usqp=CAU"
            alt="Event"
            className="h-32 w-full object-cover rounded bg-gray-100"
          />
        </div>

        <h3 className="font-semibold text-blue-600">{event.title}</h3>
        <p className="text-gray-700 text-sm">{event.description}</p>
        <p className="text-gray-600 text-xs mt-1">
          📍 {event.location}
        </p>
        <p className="text-gray-600 text-xs mt-1">
          🏁 {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
        </p>
        <p className="text-gray-600 text-xs mt-1">
          🎁 Prize Pool: ₹{event.prizePool}
        </p>

        <div className="mt-3 bg-blue-600 text-white text-center py-2 rounded">
          Join Event
        </div>
      </a>
    ))}
  </div>
</section>
      
    </main>
  </div></>
  )
};

export default Feed;
