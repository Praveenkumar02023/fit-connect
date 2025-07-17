import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import {
  Calendar,
  Repeat,
  Trophy,
  CheckCircle,
  CreditCard,
  DollarSign,
} from "lucide-react";

const Earnings = () => {
  const { token, url } = useContext(StoreContext);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [sessionEarnings, setSessionEarnings] = useState(0);
  const [subscriptionEarnings, setSubscriptionEarnings] = useState(0);
  const [eventEarnings, setEventEarnings] = useState(0);
  const [sessionPayments, setSessionPayments] = useState([]);
  const [subscriptionPayments, setSubscriptionPayments] = useState([]);
  const [eventPayments, setEventPayments] = useState([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        let total = 0,
          sessionTotal = 0,
          subsTotal = 0,
          eventTotal = 0;
        let sessionPaymentList = [],
          subsPaymentList = [],
          eventPaymentList = [];

        // Sessions
        const sessionRes = await axios.get(`${url}/api/v1/trainer/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sessions = sessionRes.data.allSessions.filter(
          (s) => s.status === "confirmed" || s.status === "completed"
        );

        for (const session of sessions) {
          const paymentRes = await axios.get(
            `${url}/api/v1/payment/user/${session.clientId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const sessionPaymentsForUser = paymentRes.data.payments.filter(
            (p) =>
              p.purpose === "Session" &&
              p.referenceId === session._id &&
              p.status === "success"
          );

          for (const payment of sessionPaymentsForUser) {
            const userRes = await axios.get(
              `${url}/api/v1/user/${session.clientId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            sessionPaymentList.push({
              clientName: userRes.data.user.name,
              purpose: payment.purpose,
              amount: payment.amount,
              createdAt: payment.createdAt,
            });
            sessionTotal += payment.amount;
          }
        }

        // Subscriptions
        const subsRes = await axios.get(`${url}/api/v1/subscription/trainer`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        for (const sub of subsRes.data.Allsubscription) {
          const paymentRes = await axios.get(
            `${url}/api/v1/payment/user/${sub.userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const subsPaymentsForUser = paymentRes.data.payments.filter(
            (p) =>
              p.purpose === "Subscription" &&
              p.referenceId === sub._id &&
              p.status === "success"
          );

          for (const payment of subsPaymentsForUser) {
            const userRes = await axios.get(
              `${url}/api/v1/user/${sub.userId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            subsPaymentList.push({
              clientName: userRes.data.user.name,
              purpose: payment.purpose,
              amount: payment.amount,
              createdAt: payment.createdAt,
            });
            subsTotal += payment.amount;
          }
        }

        // Events
        const eventRes = await axios.get(`${url}/api/v1/event/trainer`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        for (const event of eventRes.data.events) {
          const participantRes = await axios.get(
            `${url}/api/v1/event/${event._id}/participants`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          for (const participant of participantRes.data.participants) {
            const paymentRes = await axios.get(
              `${url}/api/v1/payment/user/${participant.userId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const eventPaymentsForUser = paymentRes.data.payments.filter(
              (p) =>
                p.purpose === "Event" &&
                p.referenceId === event._id &&
                p.status === "success"
            );

            for (const payment of eventPaymentsForUser) {
              eventPaymentList.push({
                clientName: participant.name,
                purpose: payment.purpose,
                amount: payment.amount,
                createdAt: payment.createdAt,
              });
              eventTotal += payment.amount;
            }
          }
        }

        setSessionEarnings(sessionTotal);
        setSubscriptionEarnings(subsTotal);
        setEventEarnings(eventTotal);
        setTotalEarnings(sessionTotal + subsTotal + eventTotal);
        setSessionPayments(sessionPaymentList);
        setSubscriptionPayments(subsPaymentList);
        setEventPayments(eventPaymentList);
      } catch (err) {
        console.error("Error fetching earnings:", err);
      }
    };

    fetchEarnings();
  }, [token, url]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Your Total Earnings
      </h1>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <SummaryCard
          icon={<DollarSign size={28} />}
          title="Total Earnings"
          amount={totalEarnings}
          bg="bg-green-50"
          text="text-green-700"
        />
        <SummaryCard
          icon={<Calendar size={28} />}
          title="Sessions"
          amount={sessionEarnings}
          bg="bg-blue-50"
          text="text-blue-700"
        />
        <SummaryCard
          icon={<Repeat size={28} />}
          title="Subscriptions"
          amount={subscriptionEarnings}
          bg="bg-[#ede7f6]"
          text="text-purple-700"
        />
        <SummaryCard
          icon={<Trophy size={28} />}
          title="Events"
          amount={eventEarnings}
          bg="bg-[#fff2e7]"
          text="text-orange-700"
        />
      </div>

      {/* Payment History Sections */}
      <PaymentSection title="Payments from Sessions" payments={sessionPayments} />
      <PaymentSection title="Payments from Subscriptions" payments={subscriptionPayments} />
      <PaymentSection title="Payments from Events" payments={eventPayments} />
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ icon, title, amount, bg, text }) => (
  <div
    className={`${bg} ${text} shadow p-6 rounded-2xl flex flex-col justify-between items-start transition-transform hover:scale-105 hover:shadow-md min-h-[140px]`}
  >
    <div className="text-3xl mb-2">{icon}</div>
    <div>
      <h3 className="text-md font-medium">{title}</h3>
      <p className="text-xl font-bold">₹{amount}</p>
    </div>
  </div>
);

// Payment Card List Component
const PaymentSection = ({ title, payments }) => {
  const formatDate = (dateString) =>
    new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-4">
        {payments.map((p, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex justify-between items-start border border-gray-100"
          >
            {/* Left Side */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {p.clientName}
              </h3>

              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                Purpose:{" "}
                <span className="ml-1 font-medium text-gray-800">
                  {p.purpose}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-1">
                <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                Method: <span className="ml-1 font-medium text-gray-800">Stripe</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                Date:{" "}
                <span className="ml-1 font-medium text-gray-800">
                  {formatDate(p.createdAt)}
                </span>
              </div>
            </div>

            {/* Right Side */}
            <div className="text-right">
              <p className="text-green-600 text-lg font-bold">+ ₹{p.amount}</p>
              <div className="flex items-center justify-end mt-1">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500 font-medium">
                  Received
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Earnings;
