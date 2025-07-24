import { useEffect, useContext, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { CheckCircle, XCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const EventSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, url } = useContext(StoreContext);

  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    const verifyAndRegister = async () => {
      const success = searchParams.get("success");
      const eventId = searchParams.get("eventId");
      const amount = searchParams.get("amount");

      if (success !== "true") {
        setStatus("error");
        toast.error("Payment failed or was cancelled.");
        return;
      }

      if (!eventId || !amount || !token || !url) {
        setStatus("error");
        toast.error("Missing data or unauthorized access.");
        return;
      }

      try {
        const res = await axios.post(
          `${url}/api/v1/event/register`,
          { eventId },
          { headers: { Authorization: `Bearer ${token}` } }
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

          toast.success("Registered successfully! 🎉");
          setStatus("success");

          setTimeout(() => {
            navigate("/user/events");
          }, 3500);
        } else {
          setStatus("error");
          toast.error("Registration failed.");
        }
      } catch (err) {
        console.error("Event registration error:", err);
        setStatus("error");
        const message =
          err?.response?.data?.message || "Something went wrong. Please try again.";
        toast.error(message);
      }
    };

    verifyAndRegister();
  }, [searchParams, token, url, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4 text-center">
      {status === "loading" && (
        <div className="text-xl font-medium text-gray-700">
          Verifying and completing registration...
        </div>
      )}

      {status === "success" && (
        <div>
          <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Event Registration Successful!
          </h1>
          <p className="text-gray-700">Thank you for registering. Redirecting shortly...</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <XCircle className="text-red-600 w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-800 mb-2">Registration Failed</h1>
          <p className="text-gray-700">There was an issue. Please try again later.</p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate("/user/events")}
          >
            Go to Events
          </button>
        </div>
      )}

      {/* React Hot Toast */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default EventSuccess;
