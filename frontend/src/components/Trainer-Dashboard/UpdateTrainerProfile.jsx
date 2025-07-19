import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { Star } from "lucide-react";
import Button from "../ui/Button";

const UpdateTrainerProfile = () => {
  const { url, token } = useContext(StoreContext);
  const [trainer, setTrainer] = useState();
  const [subscription, setSubscription] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    experience: "",
    pricing_perSession: "",
    pricing_perMonth: "",
    speciality: [],
    about: "",
    Achievements: "",
  });

  useEffect(() => {
    async function getTrainer() {
      try {
        const res = await axios.get(`${url}/api/v1/trainer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainer(res.data.trainer);
      } catch (error) {
        console.log(error);
      }
    }
    getTrainer();
  }, []);

  useEffect(() => {
    if (!trainer) return;
    setFormData({
      experience: trainer.experience || "",
      pricing_perSession: trainer.pricing_perSession || "",
      pricing_perMonth: trainer.pricing_perMonth || "",
      speciality: trainer.speciality || [],
      about: trainer.about || "",
      Achievements: trainer.Achievements || "",
    });
    console.log(trainer.experience);

    // console.log(formData);

    async function getSubscription() {
      try {
        const res = await axios.get(`${url}/api/v1/subscription/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentTrainerSubscriptions = res.data.Allsubscription.filter(
          (s) => s.trainerId === trainer._id
        );
        setSubscription(currentTrainerSubscriptions);
      } catch (error) {
        console.log(error);
      }
    }
    getSubscription();
  }, [trainer]);

  const handleSaveChanges = async () => {
    try {
      const res = await axios.patch(`${url}/api/v1/trainer/update`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        // console.log(res.data.updatedTrainer);
        const trainerRes = await axios.get(`${url}/api/v1/trainer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainer(trainerRes.data.trainer);
        setEditMode(false);
      }
    } catch (err) {
      console.error("Failed to update trainer", err);
    }
  };

  if (!trainer) return <div>Loading...</div>;

  return (
    <div className="bg-gray-100/50 min-h-screen w-full flex items-center justify-center py-10">
      <div className="flex w-[90%] max-w-6xl bg-white border rounded-xl shadow overflow-hidden">
        {/* Left Panel */}
        <div className="w-[30%] border-r border-gray-200 p-6 flex flex-col items-center gap-4">
          <img
            src={trainer.avatar || "/default-avatar.png"}
            alt="trainer"
            className="h-32 w-32 rounded-full border-2 border-black"
          />
          <div className="text-center">
            <h2 className="text-lg font-semibold">
              {trainer.firstName} {trainer.lastName}
            </h2>
            <p className="text-sm text-gray-500">
              {subscription.length} subscribers
            </p>
          </div>

          <div className="w-full text-sm">
            <h3 className="font-semibold">Speciality</h3>
            {editMode ? (
              <input
                className="w-full border p-1 mt-1"
                value={formData.speciality.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    speciality: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
            ) : (
              <p className="text-gray-600 mt-1">
                {formData.speciality.join(", ")}
              </p>
            )}
          </div>

          <div className="w-full text-sm">
            <h3 className="font-semibold">Experience</h3>
            {editMode ? (
              <input
                className="w-full border p-1 mt-1"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-600 mt-1">{formData.experience}</p>
            )}
          </div>

          <div className="text-sm">
            <h3 className="font-semibold">Rating</h3>
            <p className="flex items-center gap-1 text-yellow-500">
              <Star className="size-4" /> {trainer.rating || "-"}
            </p>
          </div>

          <div className="text-sm">
            <h3 className="font-semibold">Email</h3>
            <a
              href={`mailto:${trainer.email}`}
              className="text-blue-600 hover:underline"
            >
              {trainer.email}
            </a>
          </div>

          <div className="text-sm">
            <h3 className="font-semibold">Joined</h3>
            <p>
              {trainer.createdAt && !isNaN(new Date(trainer.createdAt))
                ? new Date(trainer.createdAt).toISOString().split("T")[0]
                : "N/A"}
            </p>
          </div>

          <div className="mt-4">
            <Button onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancel" : "Edit Profile"}
            </Button>
            {editMode && (
              <Button className="ml-2 bg-green-600" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-[70%] flex flex-col items-center justify-center p-8 gap-6">
          <div className="w-full max-w-2xl">
            <h3 className="font-semibold text-lg text-center mb-2">About Me</h3>
            {editMode ? (
              <textarea
                className="w-full border p-2"
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
              />
            ) : (
              <p className="text-sm text-gray-700 text-center">
                {formData.about}
              </p>
            )}
          </div>

          <div className="w-full max-w-2xl">
            <h3 className="font-semibold text-lg text-center mb-2">
              Achievements
            </h3>
            {editMode ? (
              <textarea
                className="w-full border p-2"
                value={formData.Achievements}
                onChange={(e) =>
                  setFormData({ ...formData, Achievements: e.target.value })
                }
              />
            ) : (
              <ul className="text-sm text-gray-700 list-disc px-5">
                {formData.Achievements.split(".").map(
                  (a, i) => a.trim() && <li key={i}>{a.trim()}.</li>
                )}
              </ul>
            )}
          </div>

          <div className="w-full max-w-2xl">
            <h3 className="font-semibold text-lg text-center mb-2">
              💰 Pricing
            </h3>
            <div className="text-center text-sm text-gray-700 space-y-2">
              <div>
                Per Session: ₹{" "}
                {editMode ? (
                  <input
                    type="number"
                    className="border px-2 py-1 w-24"
                    value={formData.pricing_perSession}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing_perSession: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  formData.pricing_perSession
                )}
              </div>
              <div>
                Per Month: ₹{" "}
                {editMode ? (
                  <input
                    type="number"
                    className="border px-2 py-1 w-24"
                    value={formData.pricing_perMonth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing_perMonth: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  formData.pricing_perMonth
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTrainerProfile;
