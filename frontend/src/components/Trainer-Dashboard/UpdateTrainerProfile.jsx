import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import {
  Star,
  Mail,
  Calendar,
  Trophy,
  Users,
  IndianRupee,
  X,
} from "lucide-react";
import Button from "../ui/Button";
import Footer from "../LandingPage/Footer"

const UpdateTrainerProfile = () => {
  const { url, token } = useContext(StoreContext);
  const [trainer, setTrainer] = useState(null);
  const [subscription, setSubscription] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [specialityInput, setSpecialityInput] = useState(""); // NEW STATE
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    experience: "",
    pricing_perSession: "",
    pricing_perMonth: "",
    speciality: [],
    about: "",
    Achievements: "",
  });

  useEffect(() => {
    async function fetchTrainer() {
      const res = await axios.get(`${url}/api/v1/trainer/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainer(res.data.trainer);
    }

    fetchTrainer();
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

    setSpecialityInput((trainer.speciality || []).join(", ")); // INITIALIZE INPUT

    async function getSubscriptions() {
      const res = await axios.get(`${url}/api/v1/subscription/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const currentTrainerSubscriptions = res.data.Allsubscription.filter(
        (s) => s.trainerId === trainer._id
      );
      setSubscription(currentTrainerSubscriptions);
    }

    getSubscriptions();
  }, [trainer]);

  const handleSaveChanges = async () => {
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        form.append(key, Array.isArray(value) ? JSON.stringify(value) : value)
      );
      if (imageFile) form.append("image", imageFile);

      const res = await axios.patch(`${url}/api/v1/trainer/update`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const updatedRes = await axios.get(`${url}/api/v1/trainer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainer(updatedRes.data.trainer);
        setEditMode(false);
        setImageFile(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!trainer) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50 pt-2 md:pt-4">
      <div className=" max-w-6xl mx-auto bg-white border border-gray-300 rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex flex-col items-center md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <img
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : trainer.avatar || "/default-avatar.png"
                }
                alt="trainer"
                className="w-24 h-24 rounded-full border-2 border-black object-cover"
              />
              {editMode && (
                <div className="flex flex-col mt-2 gap-2 items-center">
                  <label className="cursor-pointer px-4 py-1 text-xs border border-blue-500 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="sr-only"
                    />
                  </label>
                  {imageFile && (
                    <button
                      onClick={() => setImageFile(null)}
                      type="button"
                      className="text-xs px-3 py-1 border border-red-500 bg-red-100 text-red-600 rounded hover:bg-red-200 transition flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Clear
                    </button>
                  )}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold  capitalize">
                {trainer.firstName} {trainer.lastName}
              </h1>
              <p className="text-gray-500">{subscription.length} Subscribers</p>
              <p className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4" /> {trainer.rating || "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {editMode ? (
              <>
                <Button className="bg-red-600 text-white" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 text-white" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                className="bg-blue-600 hover:bg-blue-700 rounded text-white"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Specialities */}
        <div className="flex flex-wrap gap-2">
          {formData.speciality.map((item, i) => (
            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {item}
            </span>
          ))}
        </div>
        {editMode && (
          <input
            className="w-full border p-2 rounded mt-2"
            placeholder="Enter specialities separated by commas"
            value={specialityInput}
            onChange={(e) => {
              const raw = e.target.value;
              setSpecialityInput(raw);
              const items = raw.includes(",")
                ? raw.split(",").map((s) => s.trim()).filter(Boolean)
                : [raw.trim()];
              setFormData({ ...formData, speciality: items });
            }}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">About Me</h2>
              {editMode ? (
                <textarea
                  className="w-full border p-2 rounded"
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-700 whitespace-pre-line">{formData.about}</p>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Experience</h2>
              {editMode ? (
                <input
                  className="w-full border p-2 rounded"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-700 whitespace-pre-line">{formData.experience}</p>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2">Achievements</h2>
              {editMode ? (
                <textarea
                  className="w-full border p-2 rounded mt-2"
                  value={formData.Achievements}
                  onChange={(e) => setFormData({ ...formData, Achievements: e.target.value })}
                />
              ) : (
                <ul className="list-disc ml-5 mt-2 text-sm text-gray-700 space-y-1">
                  {formData.Achievements.split("\\n").map(
                    (a, i) => a.trim() && <li key={i}>{a.trim()}</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="space-y-4 flex flex-col h-full justify-between">
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-green-600" /> Pricing
              </h2>
              <div className="mt-2 space-y-3">
                <div className="p-3 rounded bg-green-100 border border-green-300">
                  <p className="text-sm text-gray-700 text-center">Per Session</p>
                  {editMode ? (
                    <input
                      type="number"
                      className="w-full border p-1 rounded mt-1"
                      value={formData.pricing_perSession}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing_perSession: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <p className="text-xl font-bold text-center text-green-700">
                      ₹{formData.pricing_perSession}
                    </p>
                  )}
                </div>

                <div className="p-3 rounded bg-purple-100 border border-purple-300">
                  <p className="text-sm text-gray-700 text-center">Per Month</p>
                  {editMode ? (
                    <input
                      type="number"
                      className="w-full border p-1 rounded mt-1"
                      value={formData.pricing_perMonth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing_perMonth: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <>
                      <p className="text-xl font-bold text-center text-purple-700">
                        ₹{formData.pricing_perMonth}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        Save 25% with monthly plan
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Contact Info</h2>
              <p className="flex items-center gap-2 text-sm text-blue-600">
                <Mail className="w-4 h-4" /> {trainer.email}
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4" /> Joined {trainer.createdAt?.split("T")[0]}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateTrainerProfile;
