import { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { ToastContainer, toast } from "react-toastify";

const EventSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, url } = useContext(StoreContext);

  useEffect(() => {
    const verifyAndRegister = async () => {
      const success = searchParams.get("success");
      const eventId = searchParams.get("eventId");
      const userId = searchParams.get("userId");
      const amount = searchParams.get("amount");

      if (success !== "true") {
        toast.error("Payment failed or was cancelled.");
        return;
      }

      if (!eventId || !amount || !token || !url) {
        toast.error("Missing necessary parameters or user not authenticated.");
        return;
      }

      try {
        const res = await axios.post(
          `${url}/api/v1/event/register`,
          { eventId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.message === "Registered successfully") {
          const paymentPayload = {
            amount: Number(amount),
            purpose: "Event",
            referenceId: eventId,
            method: "card",
            transactionId: eventId,
          };

          await axios.post(`${url}/api/v1/payment/make-payment`, paymentPayload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          toast.success("Registered successfully!");
          setTimeout(() => {
            navigate("/user/events");
          }, 3000);
        }
      } catch (err) {
        console.error("Event registration error:", err);
        const message =
          err?.response?.data?.message || "Something went wrong. Please try again.";
        toast.error(message);
      }
    };

    verifyAndRegister();
  }, [searchParams, token, url, navigate]);

  return (
    <div className="text-center mt-10 text-xl">
      <ToastContainer />
      <p>Processing your registration...</p>
    </div>
  );
};

export default EventSuccess;
