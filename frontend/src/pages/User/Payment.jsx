import React, { useState, useEffect, useContext } from "react";
import { Calendar, User, CreditCard, Search } from "lucide-react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import PaymentCard from "../../components/User-Dashboard/PaymentCard";

const Payment = () => {
  const { token, url } = useContext(StoreContext);
  const [payments, setPayments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [totalSpent, setTotalSpent] = useState(0);
  const [sessionPayments, setSessionPayments] = useState([]);
  const [eventPayments, setEventPayments] = useState([]);
  const [subscriptionPayments, setSubscriptionPayments] = useState([]);

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
              // SESSION PAYMENT ENRICHMENT
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

              // SUBSCRIPTION PAYMENT ENRICHMENT
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

              // EVENT PAYMENT ENRICHMENT
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

        setPayments(enriched);
        setTotalSpent(enriched.reduce((acc, curr) => acc + curr.amount, 0));
        setSessionPayments(enriched.filter((p) => p.purpose === "Session"));
        setEventPayments(enriched.filter((p) => p.purpose === "Event"));
        setSubscriptionPayments(enriched.filter((p) => p.purpose === "Subscription"));
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    };

    fetchUserPayments();
  }, []);

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

  return (
    <div className="px-6 py-10 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-2">Payment History</h1>
      <p className="text-gray-500 mb-8">Track all your session, event, and subscription payments</p>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-3">
          <CreditCard className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Spent</p>
            <h2 className="text-2xl font-bold text-green-600">₹{totalSpent}</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-3">
          <User />
          <div>
            <p className="text-sm text-gray-500 mb-1">Sessions</p>
            <h2 className="text-xl font-semibold">
              {sessionPayments.length} | ₹{sessionPayments.reduce((a, b) => a + b.amount, 0)}
            </h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-3">
          <Calendar />
          <div>
            <p className="text-sm text-gray-500 mb-1">Events</p>
            <h2 className="text-xl font-semibold">
              {eventPayments.length} | ₹{eventPayments.reduce((a, b) => a + b.amount, 0)}
            </h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-3">
          <User className="text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500 mb-1">Subscriptions</p>
            <h2 className="text-xl font-semibold">
              {subscriptionPayments.length} | ₹{subscriptionPayments.reduce((a, b) => a + b.amount, 0)}
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
          className="border pl-10 pr-4 py-2 rounded-lg w-full shadow-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Sectioned Payment Lists */}
      <section className="space-y-10">
        {/* Sessions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Session Payments</h2>
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
        <div>
          <h2 className="text-xl font-semibold mb-4">Event Payments</h2>
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
        <div>
          <h2 className="text-xl font-semibold mb-4">Subscription Payments</h2>
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
  );
};

export default Payment;
