import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Dumbbell, Clock, Star } from "lucide-react";
import Footer from "../../components/LandingPage/Footer";

const BuySubscription = () => {
  const { token, url } = useContext(StoreContext);
  const [trainers, setTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/trainer`);
        setTrainers(res.data.trainers || []);
      } catch (err) {
        console.error("Failed to fetch trainers", err);
      }
    };

    fetchTrainers();
  }, [url]);

  const openModal = (trainer) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTrainer(null);
    setIsModalOpen(false);
  };

  const handleConfirmSubscribe = async () => {
    try {
      const res = await axios.post(
        `${url}/api/v1/subscription/checkout-stripe-session`,
        { trainerId: selectedTrainer._id },
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

  const filteredTrainers = trainers.filter((trainer) =>
    `${trainer.firstName} ${trainer.lastName} ${trainer.speciality?.join(" ")}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-orange-50 pt-6">
      {/* Bubble Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-[200px] right-[300px] w-96 h-96 bg-violet-300 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-[50%] left-[20%] w-80 h-80 bg-orange-200 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[300px] left-[-60px] w-72 h-72 bg-lime-200 rounded-full blur-[100px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[120px] left-[40%] w-96 h-96 bg-indigo-200 rounded-full blur-[120px] opacity-30 animate-pulse" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Explore Trainers
          </h1>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base">
            Choose your trainer and subscribe to unlock your potential
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Trainer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTrainers.map((trainer) => (
            <div
              key={trainer._id}
              className="relative rounded-2xl overflow-hidden shadow-md border border-gray-300 flex flex-col bg-white p-3 sm:p-4"
            >
              <img
                src={trainer.avatar || "https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg?nii=t"}
                alt="trainer"
                className="h-36 sm:h-40 w-full object-cover rounded-lg"
              />
              <div className="pt-3 flex flex-col justify-between space-y-2 sm:space-y-3">
                <h3 className="text-center text-base sm:text-lg text-black font-semibold">
                  {trainer.firstName + " " + trainer.lastName}
                </h3>

                <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground mb-1">
                  <Dumbbell size={18} className="text-blue-500" />
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(trainer.speciality)
                      ? trainer.speciality.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-neutral-800 text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs"
                          >
                            {skill}
                          </span>
                        ))
                      : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Clock size={18} className="text-yellow-600" />
                  <span>{trainer.experience || "N/A"} yrs experience</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span>4.7/5</span>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <Button
                    size="sm"
                    className="w-full h-9 text-white bg-blue-600 hover:bg-blue-700 transition-all"
                    onClick={() => openModal(trainer)}
                  >
                    Subscribe Now
                  </Button>

                  <Button
                    size="sm"
                    className="w-full h-9 border-blue-500 text-blue-700 hover:bg-blue-100 transition-all"
                    variant="outline"
                    onClick={() => navigate(`/user/trainers/${trainer._id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && selectedTrainer && (
        <div className="fixed h-auto inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">
              Confirm Subscription
            </h2>

            <img
              src={selectedTrainer.avatar || "https://i.imgur.com/fmYr5lP.png"}
              alt="trainer"
              className="h-auto w-full object-cover rounded-lg mb-4"
            />

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {selectedTrainer.firstName}{" "}
                {selectedTrainer.lastName}
              </p>
              <p>
                <strong>Experience:</strong> {selectedTrainer.experience} yrs
              </p>
              <p>
                <strong>Specialities:</strong>{" "}
                {Array.isArray(selectedTrainer.speciality)
                  ? selectedTrainer.speciality.join(", ")
                  : "N/A"}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="w-full px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubscribe}
                className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm Subscription
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default BuySubscription;
