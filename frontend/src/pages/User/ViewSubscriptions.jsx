import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { FaCalendarAlt, FaMoneyBill, FaReceipt } from "react-icons/fa";
import Footer from "../../components/LandingPage/Footer";

const ViewSubscriptions = () => {
  const { token, url } = useContext(StoreContext);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [expiredSubscriptions, setExpiredSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/subscription/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedSubscriptions = await Promise.all(
          res.data.Allsubscription.map(async (sub) => {
            const endDate = new Date(sub.endDate);
            const now = new Date();

            // Auto-expire
            if (endDate < now && sub.isActive) {
              await axios.post(
                `${url}/api/v1/subscription/cancel`,
                { subscriptionId: sub._id },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              sub.isActive = false;
            }

            // Fetch trainer name and speciality
            const trainerRes = await axios.get(`${url}/api/v1/trainer/${sub.trainerId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const trainer = trainerRes.data.trainer;

            return {
              ...sub,
              trainerName: `${trainer.firstName} ${trainer.lastName}`,
              speciality: trainer.speciality?.join(", ") || "N/A",
              avatar: trainer.avatar,
            };
          })
        );

        const active = updatedSubscriptions.filter((s) => s.isActive);
        const expired = updatedSubscriptions.filter((s) => !s.isActive);
        setActiveSubscriptions(active);
        setExpiredSubscriptions(expired);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [token, url]);

  const handleCancel = async (id) => {
    const confirm = window.confirm("Are you sure you want to cancel the subscription?");
    if (!confirm) return;

    try {
      await axios.post(
        `${url}/api/v1/subscription/cancel`,
        { subscriptionId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveSubscriptions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Cancellation failed", err);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 pt-6 overflow-hidden">
      {/* Decorative Blurred Bubbles */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-300/20 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-blue-200/20 rounded-full blur-2xl z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">📦 My Subscriptions</h1>
          <p className="text-gray-600 mt-2">Manage your current and past trainer subscriptions easily.</p>
        </div>

        {/* Active Subscriptions */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🔵 Active Subscriptions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSubscriptions.length === 0 && (
              <p className="text-gray-500">No active subscriptions</p>
            )}
            {activeSubscriptions.map((sub) => (
              <div key={sub._id} className="flex flex-col justify-between bg-gray-50 border border-gray-300 rounded-xl shadow-lg p-5">
                {/* Trainer Info */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={
                        sub.avatar ||
                        "https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                      }
                      alt="trainer_img"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{sub.trainerName}</h3>
                      <p className="text-sm text-gray-500">{sub.speciality}</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>

                {/* Vertical Gap */}
                <div className="my-3 border-t border-gray-200" />

                {/* Subscription Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt /> Start Date:
                    </div>
                    <span className="font-medium">{formatDate(sub.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt /> End Date:
                    </div>
                    <span className="font-medium">{formatDate(sub.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <FaMoneyBill /> Amount Paid:
                    </div>
                    <span className="font-medium">₹{sub.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <FaReceipt /> Payment ID:
                    </div>
                    <span className="font-medium">{sub.paymentId}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCancel(sub._id)}
                  className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg"
                >
                  Cancel Subscription
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Expired Subscriptions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">⚫ Expired Subscriptions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {expiredSubscriptions.length === 0 && (
              <p className="text-gray-500">No expired subscriptions</p>
            )}
            {expiredSubscriptions.map((sub) => (
              <div key={sub._id} className="flex flex-col justify-between bg-gray-50 border border-gray-300 rounded-xl shadow-lg p-5">
                {/* Trainer Info */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={
                        sub.avatar ||
                        "https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                      }
                      alt="trainer_img"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{sub.trainerName}</h3>
                      <p className="text-sm text-gray-500">{sub.speciality}</p>
                    </div>
                  </div>
                  <span className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                    Expired
                  </span>
                </div>

                {/* Vertical Gap */}
                <div className="my-3 border-t border-gray-200" />

                {/* Subscription Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt /> Start Date:
                    </div>
                    <span className="font-medium">{formatDate(sub.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt /> End Date:
                    </div>
                    <span className="font-medium">{formatDate(sub.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <FaMoneyBill /> Amount Paid:
                    </div>
                    <span className="font-medium">₹{sub.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <FaReceipt /> Payment ID:
                    </div>
                    <span className="font-medium">{sub.paymentId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ViewSubscriptions;
