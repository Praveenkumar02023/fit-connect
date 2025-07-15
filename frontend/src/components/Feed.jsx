import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";



const Feed = () => {
  
  const [event, setEvent] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const { url, token } = useContext(StoreContext);

  useEffect(() => {
    async function getEvents() {
      try {
        const res = await axios.get(`${url}/api/v1/event/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status != 200) {
          return;
        }

        setEvent(res.data.allEvents);
      } catch (error) {
        console.log(error);
      }
    }

    async function getTrainers() {
      try {
        const res = await axios.get(`${url}/api/v1/trainer/`);

        if (res.status != 200) {
          return;
        }
        console.log(res);

        setTrainers(res.data.trainers);
      } catch (error) {
        console.log(error);
      }
    }

    getEvents();
    getTrainers();
  }, []);

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
                  key={t._id}
                  href={`/trainers/${t._id}`}
                  className="block border border-gray-300 p-4 rounded shadow hover:shadow-lg transition"
                >
                  <div className="relative mb-4">
                    {/* Featured Tag */}
                    {t.featured && (
                      <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZcnsKC3iF9pB8_po80WXkn7h_3fd2bNx-Rq9T6B_mCx3IDZsdPjG8qNYt0pPC_YhJEA&usqp=CAU"
                      alt={`${t.firstName} ${t.lastName}`}
                      className="h-32 w-full object-cover rounded bg-gray-100"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="font-semibold text-blue-600">
                    {t.firstName} {t.lastName}
                  </h3>

                  {/* Specialities */}
                  <p className="text-gray-700">
                    {t.speciality.length > 0
                      ? t.speciality.join(", ")
                      : "No specialities listed"}
                  </p>

                  {/* Rating & Students */}
                  <div className="flex justify-between items-center text-gray-700 text-sm mt-1">
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
                      <span>{t.rating ?? "4.8"}</span> {/* fallback rating */}
                    </div>

                    <div className="text-right text-sm text-gray-600">
                      {t.students ?? "100+"} students{" "}
                      {/* fallback student count */}
                    </div>
                  </div>

                  {/* Profile CTA */}
                  <div className="mt-2 bg-blue-600 text-white text-center py-2 rounded">
                    View Profile
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
              {event
                .filter((e) => e.status === "upcoming")
                .map((event) => (
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

                    <h3 className="font-semibold text-blue-600">
                      {event.title}
                    </h3>
                    <p className="text-gray-700 text-sm">{event.description}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      📍 {event.location}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      🏁 {new Date(event.date).toLocaleDateString()} at{" "}
                      {new Date(event.date).toLocaleTimeString()}
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
              {event
                .filter((e) => e.status === "ongoing")
                .map((event) => (
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

                    <h3 className="font-semibold text-blue-600">
                      {event.title}
                    </h3>
                    <p className="text-gray-700 text-sm">{event.description}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      📍 {event.location}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      🏁 {new Date(event.date).toLocaleDateString()} at{" "}
                      {new Date(event.date).toLocaleTimeString()}
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
      </div>
    </>
  );
};

export default Feed;
