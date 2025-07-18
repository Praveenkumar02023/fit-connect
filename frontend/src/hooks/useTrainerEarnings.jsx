import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";

export const useTrainerEarnings = () => {
  const { token, url } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  const [earnings, setEarnings] = useState({
    total: 0,
    sessions: 0,
    subscriptions: 0,
    events: 0,
    sessionPayments: [],
    subscriptionPayments: [],
    eventPayments: [],
  });

  const [monthlyEarnings, setMonthlyEarnings] = useState([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        let total = 0, sessionTotal = 0, subsTotal = 0, eventTotal = 0;
        let sessionPaymentList = [], subsPaymentList = [], eventPaymentList = [];

        let sessionMonthTotal = 0, subsMonthTotal = 0, eventMonthTotal = 0;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

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

            const paymentDate = new Date(payment.createdAt);
            const isCurrentMonth =
              paymentDate.getMonth() === currentMonth &&
              paymentDate.getFullYear() === currentYear;

            sessionPaymentList.push({
              clientName: userRes.data.user.name,
              purpose: payment.purpose,
              amount: payment.amount,
              createdAt: payment.createdAt,
            });

            sessionTotal += payment.amount;
            if (isCurrentMonth) sessionMonthTotal += payment.amount;
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

            const paymentDate = new Date(payment.createdAt);
            const isCurrentMonth =
              paymentDate.getMonth() === currentMonth &&
              paymentDate.getFullYear() === currentYear;

            subsPaymentList.push({
              clientName: userRes.data.user.name,
              purpose: payment.purpose,
              amount: payment.amount,
              createdAt: payment.createdAt,
            });

            subsTotal += payment.amount;
            if (isCurrentMonth) subsMonthTotal += payment.amount;
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
              const paymentDate = new Date(payment.createdAt);
              const isCurrentMonth =
                paymentDate.getMonth() === currentMonth &&
                paymentDate.getFullYear() === currentYear;

              eventPaymentList.push({
                clientName: participant.name,
                purpose: payment.purpose,
                amount: payment.amount,
                createdAt: payment.createdAt,
              });

              eventTotal += payment.amount;
              if (isCurrentMonth) eventMonthTotal += payment.amount;
            }
          }
        }

        total = sessionTotal + subsTotal + eventTotal;

        setEarnings({
          total,
          sessions: sessionTotal,
          subscriptions: subsTotal,
          events: eventTotal,
          sessionPayments: sessionPaymentList,
          subscriptionPayments: subsPaymentList,
          eventPayments: eventPaymentList,
        });

        // Set chart data (3 bars for current month)
        const currentMonthData = [
          { category: "Sessions", amount: sessionMonthTotal },
          { category: "Subscriptions", amount: subsMonthTotal },
          { category: "Events", amount: eventMonthTotal },
        ];
        setMonthlyEarnings(currentMonthData);

      } catch (err) {
        console.error("Error fetching trainer earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [token, url]);

  return { earnings, loading, monthlyEarnings };
};
export default useTrainerEarnings