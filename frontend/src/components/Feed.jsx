// src/Feed.jsx
import React from 'react';

const trainers = [
  { id:1,name:'Sarah Johnson', speciality:'Yoga & Meditation', rating:4.9, students:2400,featured:true},
  { id:2,name:'Mike Chen', speciality:'Strength Training', rating:4.8, students:1800,featured:false},
  { id:3,name:'Emma Wilson', speciality:'HIIT & Cardio', rating:4.9, students:3200,featured:true},
  { id:4,name:'David Rodriguez', speciality:'Pilates', rating:4.7, students:1500,featured:false},
];

const sessions = [
  { id:1,title:'Morning Power Yoga', trainer:'Sarah Johnson', level:'Beginner', duration:30, joined:145, trending:true },
  { id:2,title:'HIIT Blast', trainer:'Emma Wilson', level:'Intermediate', duration:25, joined:89, trending:true },
  { id:3,title:'Strength Builder', trainer:'Mike Chen', level:'Advanced', duration:45, joined:67, trending:false },
  { id:4,title:'Core Fusion', trainer:'David Rodriguez', level:'Intermediate', duration:35, joined:112, trending:true },
];

// const events = [
//   { id:1, date:'Dec 15', when:'Today', title:'Sunrise Yoga Session', time:'7:00 AM', location:'Central Park', spots:12, type:'Free' },
//   { id:2, date:'Dec 16', when:'Tomorrow', title:'HIIT Bootcamp', time:'6:30 PM', location:'Fitness Studio A', spots:8, type:'Premium' },
//   { id:3, date:'Dec 18', when:'Monday', title:'Strength Training Workshop', time:'10:00 AM', location:'Gym Floor 2', spots:15, type:'Workshop' },
// ];

const Feed = () => (
  <div className="h-screen flex flex-col bg-white">
    {/* Navbar & Banner */}
    <header className="bg-white p-6 shadow flex flex-col space-y-4">
      <nav className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">FitConnect</h1>
        <div className="flex items-center space-x-4">
          {/* <button className="text-gray-600">🔔</button> */}
<div className="flex flex-col items-center text-gray-700 space-y-1 transform rotate-[140deg]">
  {/* Upward hollow triangle */}
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M12 7l5 8H7l5-8z" transform="rotate(180 12 12)" />
  </svg>

  {/* Downward hollow triangle */}
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M12 7l5 8H7l5-8z" />
  </svg>
</div>








          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </nav>
       {/* <div className="bg-blue-500 text-white p-3 rounded flex justify-between items-center">
        <span className="font-medium">NEW</span>
        <p className="flex-1 px-4">🎉 Join our 30‑day fitness challenge! Get 20% off premium membership this month.</p>
        <button>✕</button>
      </div>  */}
      <input
        type="text"
        placeholder="Search workouts, trainers, or programs..."
        className="w-full border border-gray-300 p-2 rounded"
      />
      <div className="flex space-x-2">
        {['All','Yoga','Strength','HIIT','Cardio','Pilates'].map(tab => (
          <button key={tab} className="px-4 py-2 bg-gray-100 rounded text-gray-700 hover:bg-gray-200">
            {tab}
          </button>
        ))}
      </div>
    </header>

    {/* Scrollable Main Content */}
    <main className="flex-1 overflow-y-auto min-h-0 p-6 space-y-8">
      {/* Featured Trainers */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Featured Trainers</h2>
          <a href="/trainers" className="text-blue-600">View All →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {trainers.map(t => (
            <a
              key={t.id}
              href={`/trainers/${t.id}`}
              className="block border border-gray-300 p-4 rounded shadow hover:shadow-lg transition"
              >

          {/* <div className="relative mb-4">
  {t.featured && (
    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
      Featured
    </span>
  )}
  <div className="h-32 bg-gray-200 flex items-center justify-center rounded">
    <span className="text-gray-400 text-3xl"></span>
  </div>
</div> */}
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


              <div className="mt-2 bg-blue-600 text-white text-center py-2 rounded">View Profile</div>
            </a>
          ))}
        </div>
        {/* Featured Trainers 2nd edit*/}

  {/* <div className="trainer-cards">
  {trainers.map((trainer, index) => (
    <div className="trainer-card" key={index}>
      <div className="trainer-img">
        {trainer.featured && <span className="featured-tag">Featured</span>}
        <div className="img-placeholder">📷</div>
      </div>
      <div className="trainer-info">
        <h4>{trainer.name}</h4>
        <p>{trainer.speciality}</p>
        <p className="rating">⭐ {trainer.rating} &nbsp;&nbsp; {trainer.students} students</p>
        <button className="profile-btn">View Profile</button>
      </div>
    </div>
  ))}
</div> */}

    </section>

      {/* Trending Sessions */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Trending Workout Sessions</h2>
          <a href="/sessions" className="text-blue-600">View All Sessions →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {sessions.map(s => (
            <a
              key={s.id}
              href={`/sessions/${s.id}`}
              className="block border border-gray-300 p-4 rounded shadow hover:shadow-lg transition"
            >
                {/* <div className="relative mb-5">
              {s.trending && (
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs inline-block mb-2">
                Trending
                </span>
              )} <img
    src="https://www.imageenhan.com/static/icons/icon-placeholder.svg"
    alt="Session Placeholder"
    className="h-32 w-full object-cover rounded bg-gray-100"
  />
  </div> */}
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






              {/* <div className="h-32 bg-gray-200 mb-4"></div> */}
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-gray-700">with {s.trainer}</p>
              {/* <div className="flex space-x-2 text-gray-700 text-sm my-2">


              <span className="px-2 bg-green-100 rounded">{s.level}</span>
                
                
                <span
  className={`px-2 py-1 rounded text-sm font-semibold
    ${s.level === 'Beginner' ? 'bg-green-100 text-green-700' :
      s.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
      s.level === 'Advanced' ? 'bg-red-100 text-red-700' : ''
    }`}
>
  {s.level}
</span>            
               
                <span>⌚{s.duration} min</span>

                
                <span>👥 {s.joined} joined</span>
              </div> */}

<div className="flex justify-between items-center mt-2 text-sm text-gray-600">
  {/* Difficulty Tag */}
  {/* <span
    className={`px-2 py-1 rounded text-xs font-semibold
      ${s.level === 'Beginner' ? 'bg-green-100 text-green-700' :
        s.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
        s.level === 'Advanced' ? 'bg-red-100 text-red-700' : ''
      }`}
  >
    {s.level}
  </span> */}

  <span
  className={`px-3 py-1 rounded-full text-xs font-medium
    ${s.level === 'Beginner' ? 'bg-green-200 text-green-800' :
      s.level === 'Intermediate' ? 'bg-yellow-200 text-yellow-800' :
      s.level === 'Advanced' ? 'bg-red-200 text-red-800' : ''
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


              <div className="mt-2 bg-blue-600 text-white text-center py-2 rounded">Join Now</div>
            </a>
          ))}
        </div>
      </section>

      {/* Upcoming Events with horizontal carousel */}
      {/* <section>
        <h2 className="text-xl font-semibold text-black">Upcoming Events</h2>
        <div className="relative">
          <button
            onClick={() => document.getElementById('events-carousel').scrollBy({ left: -300, behavior: 'smooth' })}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow"
          >
            ←
          </button>
          <div id="events-carousel" className="overflow-x-auto scroll-smooth flex space-x-4 pb-4">
            {events.map(e => (
              <a
                key={e.id}
                href={`/events/${e.id}`}
                className="flex-shrink-0 min-w-[300px] border border-gray-300 p-4 rounded shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-blue-600 font-semibold">{e.date}</h3>
                    <p className="text-gray-500">{e.when}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-sm">
                    {e.type}
                  </span>
                </div>
                <h4 className="font-semibold mt-2">{e.title}</h4>
                <p className="text-gray-700">📅 {e.time}</p>
                <p className="text-gray-700">📍 {e.location}</p>
                <p className="text-gray-500">{e.spots} spots left</p>
                <div className="mt-2 bg-blue-600 text-white text-center py-2 rounded">
                  {e.type === 'Free' ? 'Join Free' : 'Register'}
                </div>
              </a>
            ))}
          </div>
          <button
            onClick={() => document.getElementById('events-carousel').scrollBy({ left: 300, behavior: 'smooth' })}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow"
          >
            →
          </button>
        </div>
      </section> */}

      {/* Health & Fitness Tips */}
      {/* <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Health & Fitness Tips</h2>
          <a href="/blog" className="text-blue-600">View All Articles →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <a
              key={i}
              href={`/blog/${i}`}
              className="block border border-gray-300 p-4 rounded shadow hover:shadow-lg transition"
            >
              <div className="h-32 bg-gray-200 mb-4"></div>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">Category</span>
              <h3 className="font-semibold mt-2">Article Title {i}</h3>
              <p className="text-gray-700">Short description...</p>
            </a>
          ))}
        </div>
      </section> */}
    </main>
  </div>
);

export default Feed;
