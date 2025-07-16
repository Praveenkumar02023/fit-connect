import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { useParams } from "react-router-dom";
import { Dot, Star } from "lucide-react";
import Button from "../ui/Button";

const TrainerProfile = () => {
  const { id } = useParams();

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

        if (res.status != 200) {
          console.log("error in getting trainer profile");
          console.log(res);
          return;
        }
        console.log(res.data.trainer);

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

        if (res.status != 200) {
          console.log("error getting subscriptions");
          console.log(res);
          return;
        }

        console.log(res.data.Allsubscription);

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

  if (!trainer) return <div>Loading...</div>;
  if (!subscription) return <div>Loading...</div>;

  return (
    <div className="bg-gray-100/50 h-screen flex items-center justify-center w-full px-[8rem] py-[2rem]">
      <div className=" h-[40rem] w-full bg-gray-100 flex p-4 gap-x-4">
        <div className="p-4 flex flex-col  h-full w-[30%] bg-white border rounded-xl border-gray-200 shadow ">
          <div className="w-full flex justify-center">
            <img
              src={trainer.avatar}
              alt="trainer profile"
              className="h-32 w-32 rounded-full border-2 border-black"
            />
          </div>
          <div className="pt-2 w-full flex-col items-center">
            <h2 className="text-center font-semibold text-lg font-sans">
              {trainer.firstName} {trainer.lastName}
            </h2>
            <div className="text-sm text-gray-500 w-full flex items-center justify-center text-center font-semibold gap-x-2">
              <h3>{subscription ? subscription.length : 0}</h3>
              <h3>subscribers</h3>
            </div>
          </div>

          <div className=" border border-dashed p-2 border-black w-full justify-center mt-3 text-sm font-semibold flex flex-wrap text-center">
            {trainer.speciality.map((s, i) => {
              return (
                <div key={i} className="underline px-1 flex">
                  {s}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center w-full justify-center gap-x-1 ">
            <h3>Rating : </h3>
            <h3 className="flex gap-x-1 text-center">
              {
                <Star className="text-yellow-400 fill-yellow-300 bg-transparent mt-1 size-5 " />
              }{" "}
              {trainer.rating}
            </h3>
          </div>

          <div className="px-4 mt-4 w-full flex flex-col items-center justify-center">
            <h1 className="font-semibold text-lg">Experience</h1>
            <p className="text-gray-600 mt-2 text-md flex flex-wrap text-center">
              {trainer.experience}
            </p>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center">
            <h1 className="font-semibold text-lg">Reach Out</h1>
            <div className="flex gap-x-2 ">
              <h2>Mail:</h2>
              <a
                href={"mailto:" + trainer.email}
                className="text-blue-700 hover:underline"
              >
                {trainer.email}
              </a>
            </div>
          </div>
          <div className="mt-5 flex gap-x-2 items-center justify-center">
            <h2 className="font-semibold text-sm">Joined on : </h2>
            <h1 className="font-semibold text-sm ">
              {new Date(trainer.createdAt).toISOString().split("T")[0]}
            </h1>
          </div>
        </div>

        {/* second section */}

        <div className="p-12 h-full w-[70%] bg-white border rounded-xl border-gray-200 shadow flex flex-col gap-y-4 ">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-semibold text-lg">About Me</h1>
            <p className="text-gray-700 font-semibold text-sm">
              {trainer.about}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h1 className="font-semibold text-lg">Achievements</h1>
            <div className="text-gray-700 font-semibold text-sm mt-2 space-y-1">
              {trainer.Achievements.split(".").map((e, i) =>
                e.trim() ? (
                  <div className="flex">
                    {<Dot />}
                    <div key={i}>{e.trim()}.</div>
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div className="mt-2 w-full">
            <div className="bg-white  flex flex-col items-center">
              <h2 className="text-lg font-semibold text-center mb-2">
                💰 Pricing
              </h2>

              <div className="flex flex-col gap-y-2 text-center text-sm text-gray-700 font-medium w-full">
                {/* Per Session */}
                <div className="border border-gray-500 border-dashed p-3 rounded">
                  <span className="text-gray-500">Per Session:</span>
                  <span className="ml-2 font-semibold text-black">
                    ₹{trainer.pricing_perSession}
                  </span>
                  <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-sm transition">
                    Book Session
                  </button>
                </div>

                {/* Per Month */}
                <div className="border border-gray-500 border-dashed p-3 rounded mt-2">
                  <span className="text-gray-500">Per Month:</span>
                  <span className="ml-2 font-semibold text-black">
                    ₹{trainer.pricing_perMonth}
                  </span>
                  <button className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-1 rounded text-sm transition">
                    Subscribe Monthly
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
