import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate, useParams } from "react-router-dom";
import { Dot, Star } from "lucide-react";

const TrainerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);
  const [trainer, setTrainer] = useState();
  const [subscription, setSubscription] = useState([]);

  useEffect(() => {
    async function getTrainer() {
      try {
        const res = await axios.get(`${url}/api/v1/trainer/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status != 200) return;

        setTrainer(res.data.trainer);
      } catch (error) {
        console.log(error);
      }
    }

    getTrainer();
  }, []);

  useEffect(() => {
    if (!trainer) return;

    async function getSubscription() {
      try {
        const res = await axios.get(`${url}/api/v1/subscription/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const all = res.data?.Allsubscription ?? [];
        const currentTrainerSubscriptions = all.filter(
          (s) => s.trainerId === trainer._id
        );
        setSubscription(currentTrainerSubscriptions);
      } catch (error) {
        console.log(error);
      }
    }

    getSubscription();
  }, [trainer]);

  const handleSubscribe = async (trainer) => {
    try {
      const res = await axios.post(
        `${url}/api/v1/subscription/checkout-stripe-session`,
        { trainerId: trainer._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success && res.data.sessionurl) {
        window.location.href = res.data.sessionurl;
      } else {
        alert("Payment session creation failed");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  if (!trainer || !subscription) return <div>Loading...</div>;

  return (
    <div className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen w-full overflow-hidden">
      {/* Decorative Bubbles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full opacity-30 blur-3xl animate-pulse z-10" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400 rounded-full opacity-30 blur-3xl animate-pulse z-0" />
      <div className="absolute top-[20%] right-[30%] w-24 h-24 bg-pink-300 rounded-full opacity-20 blur-2xl animate-pulse z-0" />
      <div className="absolute bottom-[30%] left-[20%] w-20 h-20 bg-indigo-300 rounded-full opacity-20 blur-2xl animate-pulse z-0" />
      <div className="absolute top-[40%] left-[50%] w-28 h-28 bg-green-200 rounded-full opacity-20 blur-2xl animate-pulse z-0" />

      <div className="relative z-10 px-6 md:px-12 lg:px-[8rem] py-8 flex flex-col items-center justify-center">
        <div className="w-full bg-white/50 backdrop-blur-sm flex flex-col lg:flex-row gap-4 rounded-xl shadow-lg p-4">
          {/* Left Panel */}
          <div className="p-4 flex flex-col w-full lg:w-[30%] bg-white border rounded-xl border-gray-200 shadow">
            <div className="w-full flex justify-center">
              <img
                src={
                  trainer.avatar ||
                  "https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg?nii=t"
                }
                alt="trainer profile"
                className="h-32 w-32 rounded-full border-2 border-black object-cover"
              />
            </div>

            <div className="pt-4 text-center">
              <h2 className="font-semibold text-lg">
                {trainer.firstName} {trainer.lastName}
              </h2>
              <div className="text-sm text-gray-500 font-semibold mt-1">
                {subscription?.length || 0} subscribers
              </div>
            </div>

            <div className="border border-dashed p-2 border-black w-full justify-center mt-3 text-sm font-semibold flex flex-wrap text-center">
              {trainer.speciality?.length > 0
                ? trainer.speciality.map((s, i) => (
                    <div key={i} className="underline px-1 flex">
                      {s}
                    </div>
                  ))
                : "No speciality found"}
            </div>

            <div className="mt-3 flex items-center justify-center gap-x-1">
              <h3>Rating:</h3>
              <div className="flex items-center gap-x-1 text-center">
                <Star className="text-yellow-400 fill-yellow-300 size-5" />
                {trainer.rating || "-"}
              </div>
            </div>

            <div className="px-4 mt-4 text-center">
              <h1 className="font-semibold text-lg">Experience</h1>
              <p className="text-gray-600 mt-2 text-md">
                {trainer.experience || "No experience"}
              </p>
            </div>

            <div className="mt-4 text-center">
              <h1 className="font-semibold text-lg">Reach Out</h1>
              <div className="flex justify-center gap-x-2 text-sm">
                <span>Mail:</span>
                <a
                  href={`mailto:${trainer.email}`}
                  className="text-blue-700 hover:underline"
                >
                  {trainer.email}
                </a>
              </div>
            </div>

            <div className="mt-5 flex gap-x-2 justify-center text-sm">
              <span className="font-semibold">Joined on:</span>
              <span className="font-semibold">
                {new Date(trainer.createdAt).toISOString().split("T")[0]}
              </span>
            </div>
          </div>

          {/* Right Panel */}
          <div className="p-6 h-full w-full lg:w-[70%] bg-white border rounded-xl border-gray-200 shadow flex flex-col justify-between">
            {/* Top Section */}
            <div className="flex flex-col gap-y-6">
              <div>
                <h1 className="font-semibold text-xl mb-2 text-gray-800 border-b pb-1 border-gray-300 w-fit">
                  About Me
                </h1>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {trainer.about || "Nothing found"}
                </p>
              </div>

              {trainer.Achievements && (
                <div>
                  <h1 className="font-semibold text-xl mb-2 text-gray-800 border-b pb-1 border-gray-300 w-fit">
                    Achievements
                  </h1>
                  <div className="text-gray-700 text-sm mt-2 space-y-2">
                    {trainer.Achievements.split(".").map((e, i) =>
                      e.trim() ? (
                        <div key={i} className="flex items-start gap-x-2">
                          <Dot className="text-blue-500 mt-[2px]" />
                          <span>{e.trim()}.</span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Section: Pricing */}
            <div className="mt-6">
              <div className="rounded-md border border-gray-200 p-4 shadow-inner bg-white">
                <h2 className="text-lg font-semibold text-center mb-4 text-gray-800">
                  💰 Pricing
                </h2>

                <div className="flex flex-col gap-y-4">
                  <div className="border border-dashed border-gray-500 rounded p-4">
                    <div className="flex gap-x-2">
                      <span className="text-gray-600 text-sm">Per Session:</span>
                      <span className="text-black text-lg font-semibold">
                        ₹{trainer.pricing_perSession}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate("/user/bookSessions")}
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all"
                    >
                      Book Session
                    </button>
                  </div>

                  <div className="border border-dashed border-gray-500 rounded p-4">
                    <div className="flex gap-x-2">
                      <span className="text-gray-600 text-sm">Per Month:</span>
                      <span className="text-black text-lg font-semibold">
                        ₹{trainer.pricing_perMonth}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSubscribe(trainer)}
                      className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-all"
                    >
                      Subscribe Monthly
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-xs text-gray-400 text-center py-4 mt-8 z-10">
          © 2025 FitConnect. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default TrainerProfile;
