import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CreditCard, User, Calendar, Search } from "lucide-react";
import { StoreContext } from "../../Context/StoreContext";
import TrainerPaymentCard from "../../components/Trainer-Dashboard/TrainerPaymentCard";
import Footer from "../../components/LandingPage/Footer";
import LogoLoader from "../../components/LogoLoader";

const Earnings = () => {
  const { token, url } = useContext(StoreContext);
  const [sessionPayments, setSessionPayments] = useState([]);
  const [eventPayments, setEventPayments] = useState([]);
  const [subscriptionPayments, setSubscriptionPayments] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        let sessionList = [];
        let eventList = [];
        let subsList = [];
        let total = 0;

        // Sessions
        const sessionRes = await axios.get(`${url}/api/v1/trainer/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const validSessions = sessionRes.data?.allSessions?.filter(
          (s) => s.status === "confirmed" || s.status === "completed"
        ) || [];

        for (const session of validSessions) {
          try {
            const paymentRes = await axios.get(
              `${url}/api/v1/payment/user/${session.clientId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const payments = paymentRes.data?.payments?.filter(
              (p) =>
                p.purpose === "Session" &&
                p.referenceId === session._id &&
                p.status === "success"
            ) || [];

            for (const p of payments) {
              try {
                const userRes = await axios.get(
                  `${url}/api/v1/user/${session.clientId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                const user = userRes.data?.user;
                if (!user) continue;

                sessionList.push({
                  ...p,
                  clientName: user.name || "Unknown Client",
                  title: "Session Payment",
                });

                total += p.amount;
              } catch (err) {
                console.warn("Failed to fetch user for session:", err.message);
              }
            }
          } catch (err) {
            console.warn("Failed to fetch payment for session:", err.message);
          }
        }

        // Subscriptions
        const subRes = await axios.get(`${url}/api/v1/subscription/trainer`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        for (const sub of subRes.data?.Allsubscription || []) {
          try {
            const paymentRes = await axios.get(
              `${url}/api/v1/payment/user/${sub.userId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const payments = paymentRes.data?.payments?.filter(
              (p) =>
                p.purpose === "Subscription" &&
                p.referenceId === sub._id &&
                p.status === "success"
            ) || [];

            for (const p of payments) {
              try {
                const userRes = await axios.get(
                  `${url}/api/v1/user/${sub.userId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                const user = userRes.data?.user;
                if (!user) continue;

                subsList.push({
                  ...p,
                  clientName: user.name || "Unknown Client",
                  title: "Trainer Subscription",
                });

                total += p.amount;
              } catch (err) {
                console.warn("Failed to fetch user for subscription:", err.message);
              }
            }
          } catch (err) {
            console.warn("Failed to fetch payments for subscription:", err.message);
          }
        }

        // Events
        const eventRes = await axios.get(`${url}/api/v1/event/trainer`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        for (const event of eventRes.data?.events || []) {
          try {
            const participantRes = await axios.get(
              `${url}/api/v1/event/${event._id}/participants`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            for (const participant of participantRes.data?.participants || []) {
              try {
                const paymentRes = await axios.get(
                  `${url}/api/v1/payment/user/${participant.userId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                const payments = paymentRes.data?.payments?.filter(
                  (p) =>
                    p.purpose === "Event" &&
                    p.referenceId === event._id &&
                    p.status === "success"
                ) || [];

                for (const p of payments) {
                  eventList.push({
                    ...p,
                    clientName: participant.name || "Event Participant",
                    title: event.title,
                  });
                  total += p.amount;
                }
              } catch (err) {
                console.warn("Failed to fetch payments for participant:", err.message);
              }
            }
          } catch (err) {
            console.warn("Failed to fetch participants for event:", err.message);
          }
        }

        setSessionPayments(sessionList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setSubscriptionPayments(subsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setEventPayments(eventList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setTotalEarned(total);
      } catch (err) {
        console.error("Error fetching trainer earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token, url]);

  const filterText = searchText.toLowerCase();
  const filteredSessions = sessionPayments.filter((p) => p.clientName.toLowerCase().includes(filterText));
  const filteredEvents = eventPayments.filter((p) => p.clientName.toLowerCase().includes(filterText));
  const filteredSubscriptions = subscriptionPayments.filter((p) => p.clientName.toLowerCase().includes(filterText));

  if (loading) return <LogoLoader />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-neutral-100 via-violet-50 to-blue-100 pt-6 overflow-hidden">
      <div className="absolute top-10 left-10 w-48 h-48 bg-purple-300/50 rounded-full blur-3xl z-10" />
      <div className="absolute bottom-80 right-10 w-60 h-60 bg-pink-300/50 rounded-full blur-3xl sm:z-10" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-blue-200/40 rounded-full blur-2xl z-10" />
      <div className="absolute top-1/2 left-30 w-40 h-40 bg-cyan-300/40 rounded-full blur-2xl z-10" />

      <div className="px-4 relative z-10 max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Earnings Overview</h1>
          <p className="text-gray-600">Track all your session, event, and subscription earnings</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#e6f4ea] p-6 rounded-xl shadow-md flex items-center gap-4">
            <CreditCard className="text-green-700" />
            <div>
              <p className="text-sm text-gray-600">Total Earned</p>
              <h2 className="text-2xl font-bold text-green-800">₹{totalEarned}</h2>
            </div>
          </div>
          <div className="bg-[#e7f0ff] p-6 rounded-xl shadow-md flex items-center gap-4">
            <User className="text-blue-700" />
            <div>
              <p className="text-sm text-gray-600">Sessions</p>
              <h2 className="text-xl font-semibold text-blue-800">
                {sessionPayments.length} | ₹{sessionPayments.reduce((a, b) => a + b.amount, 0)}
              </h2>
            </div>
          </div>
          <div className="bg-[#fff2e7] p-6 rounded-xl shadow-md flex items-center gap-4">
            <Calendar className="text-orange-700" />
            <div>
              <p className="text-sm text-gray-600">Events</p>
              <h2 className="text-xl font-semibold text-orange-800">
                {eventPayments.length} | ₹{eventPayments.reduce((a, b) => a + b.amount, 0)}
              </h2>
            </div>
          </div>
          <div className="bg-[#ede7f6] p-6 rounded-xl shadow-md flex items-center gap-4">
            <User className="text-purple-700" />
            <div>
              <p className="text-sm text-gray-600">Subscriptions</p>
              <h2 className="text-xl font-semibold text-purple-800">
                {subscriptionPayments.length} | ₹{subscriptionPayments.reduce((a, b) => a + b.amount, 0)}
              </h2>
            </div>
          </div>
        </div>

        <div className="relative mb-10">
          <Search className="absolute top-3.5 left-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by client name..."
            className="border pl-10 pr-4 py-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <section className="space-y-12">
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🧑‍💼 Session Earnings</h2>
            <div className="grid gap-6">
              {filteredSessions.map((p) => (
                <TrainerPaymentCard
                  key={p._id}
                  title={p.title}
                  clientName={p.clientName}
                  date={p.createdAt}
                  amount={p.amount}
                  transactionId={p.transactionId}
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🎉 Event Earnings</h2>
            <div className="grid gap-6">
              {filteredEvents.map((p) => (
                <TrainerPaymentCard
                  key={p._id}
                  title={p.title}
                  clientName={p.clientName}
                  date={p.createdAt}
                  amount={p.amount}
                  transactionId={p.transactionId}
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📦 Subscription Earnings</h2>
            <div className="grid gap-6">
              {filteredSubscriptions.map((p) => (
                <TrainerPaymentCard
                  key={p._id}
                  title={p.title}
                  clientName={p.clientName}
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

export default Earnings;
