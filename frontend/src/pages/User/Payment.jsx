import React, { useState, useEffect, useContext } from "react";
import { Calendar, User, CreditCard, Search } from "lucide-react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import PaymentCard from "../../components/User-Dashboard/PaymentCard";
import Footer from "../../components/LandingPage/Footer";
import LogoLoader from "../../components/LogoLoader";

const Payment = () => {
  const { token, url } = useContext(StoreContext);
  const [payments, setPayments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [totalSpent, setTotalSpent] = useState(0);
  const [sessionPayments, setSessionPayments] = useState([]);
  const [eventPayments, setEventPayments] = useState([]);
  const [subscriptionPayments, setSubscriptionPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPayments = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/payment/user-payments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const basePayments = res.data.allPayments || res.data.payments;

        const enriched = await Promise.all(
          basePayments.map(async (p) => {
            try {
              if (p.purpose === "Session") {
                const sessionRes = await axios.get(`${url}/api/v1/session/${p.referenceId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const session = sessionRes.data.session;
                const trainerId = session?.trainerId;

                let trainerName = "Unknown Trainer";
                if (trainerId) {
                  try {
                    const trainerRes = await axios.get(`${url}/api/v1/trainer/${trainerId}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    trainerName = trainerRes.data.trainer?.firstName || "Unknown Trainer";
                  } catch (err) {
                    console.warn("Failed to fetch trainer:", err.message);
                  }
                }

                return {
                  ...p,
                  sessionType: session.type,
                  sessionTrainerName: trainerName,
                };
              }

              if (p.purpose === "Subscription") {
                const subRes = await axios.get(`${url}/api/v1/subscription/${p.referenceId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const sub = subRes.data.subscription;

                const trainerRes = await axios.get(`${url}/api/v1/trainer/${sub.trainerId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const trainer = trainerRes.data.trainer;

                return {
                  ...p,
                  subscriptionTrainerName: trainer.firstName,
                };
              }

              if (p.purpose === "Event") {
                const eventRes = await axios.get(`${url}/api/v1/event/${p.referenceId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const event = eventRes.data.event;

                return {
                  ...p,
                  eventName: event.title,
                };
              }

              return p;
            } catch (err) {
              console.error("Error enriching payment:", err);
              return p;
            }
          })
        );

        const sorted = enriched.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPayments(sorted);
        setTotalSpent(sorted.reduce((acc, curr) => acc + curr.amount, 0));
        setSessionPayments(sorted.filter((p) => p.purpose === "Session"));
        setEventPayments(sorted.filter((p) => p.purpose === "Event"));
        setSubscriptionPayments(sorted.filter((p) => p.purpose === "Subscription"));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        setLoading(false);
      }
    };

    fetchUserPayments();
  }, [token, url]);

  const filterText = searchText.toLowerCase();

  const filteredSessions = sessionPayments.filter(
    (p) =>
      p.sessionTrainerName?.toLowerCase().includes(filterText) ||
      p.sessionType?.toLowerCase().includes(filterText)
  );
  const filteredEvents = eventPayments.filter((p) =>
    p.eventName?.toLowerCase().includes(filterText)
  );
  const filteredSubscriptions = subscriptionPayments.filter((p) =>
    p.subscriptionTrainerName?.toLowerCase().includes(filterText)
  );

  if (loading) return <LogoLoader />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 pt-6 overflow-hidden flex flex-col justify-between">
      {/* Decorative Bubbles */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-purple-300/40 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-300/40 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-blue-200/40 rounded-full blur-2xl z-0" />

      <div className="px-4 relative z-10 max-w-6xl mx-auto flex-grow w-full">
        {/* Header */}
        <div className="mb-10 text-center px-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">Payment History</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Track all your session, event, and subscription payments
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="bg-[#e6f4ea] p-4 sm:p-6 rounded-xl shadow-md flex items-center gap-4">
            <CreditCard className="text-green-700" />
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <h2 className="text-xl sm:text-2xl font-bold text-green-800">₹{totalSpent}</h2>
            </div>
          </div>
          <div className="bg-[#e7f0ff] p-4 sm:p-6 rounded-xl shadow-md flex items-center gap-4">
            <User className="text-blue-700" />
            <div>
              <p className="text-sm text-gray-600">Sessions</p>
              <h2 className="text-lg sm:text-xl font-semibold text-blue-800">
                {sessionPayments.length} | ₹
                {sessionPayments.reduce((a, b) => a + b.amount, 0)}
              </h2>
            </div>
          </div>
          <div className="bg-[#fff2e7] p-4 sm:p-6 rounded-xl shadow-md flex items-center gap-4">
            <Calendar className="text-orange-700" />
            <div>
              <p className="text-sm text-gray-600">Events</p>
              <h2 className="text-lg sm:text-xl font-semibold text-orange-800">
                {eventPayments.length} | ₹
                {eventPayments.reduce((a, b) => a + b.amount, 0)}
              </h2>
            </div>
          </div>
          <div className="bg-[#ede7f6] p-4 sm:p-6 rounded-xl shadow-md flex items-center gap-4">
            <User className="text-purple-700" />
            <div>
              <p className="text-sm text-gray-600">Subscriptions</p>
              <h2 className="text-lg sm:text-xl font-semibold text-purple-800">
                {subscriptionPayments.length} | ₹
                {subscriptionPayments.reduce((a, b) => a + b.amount, 0)}
              </h2>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative mb-10">
          <Search className="absolute top-3.5 left-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by trainer, session type, or event name..."
            className="border pl-10 pr-4 py-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Sectioned Payment Lists */}
        <section className="space-y-10">
          {/* Sessions */}
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Session Payments</h2>
            <div className="grid gap-6">
              {filteredSessions.map((p) => (
                <PaymentCard
                  key={p._id}
                  title={p.sessionType}
                  name={p.sessionTrainerName}
                  date={p.createdAt}
                  amount={p.amount}
                  transactionId={p.transactionId}
                />
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Event Payments</h2>
            <div className="grid gap-6">
              {filteredEvents.map((p) => (
                <PaymentCard
                  key={p._id}
                  title={p.eventName}
                  name="Event Organizer"
                  date={p.createdAt}
                  amount={p.amount}
                  transactionId={p.transactionId}
                />
              ))}
            </div>
          </div>

          {/* Subscriptions */}
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Subscription Payments</h2>
            <div className="grid gap-6">
              {filteredSubscriptions.map((p) => (
                <PaymentCard
                  key={p._id}
                  title="Trainer Subscription"
                  name={p.subscriptionTrainerName}
                  date={p.createdAt}
                  amount={p.amount}
                  transactionId={p.transactionId}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;
