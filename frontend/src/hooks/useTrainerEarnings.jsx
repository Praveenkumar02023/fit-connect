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

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        let total = 0, sessionTotal = 0, subsTotal = 0, eventTotal = 0;
        let sessionPaymentList = [], subsPaymentList = [], eventPaymentList = [];

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
      } catch (err) {
        console.error("Error fetching trainer earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [token, url]);

  return { earnings, loading };
};
