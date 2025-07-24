import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { CheckCircle, XCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const SessionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, url } = useContext(StoreContext);
  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'

  useEffect(() => {
    const verifyAndBook = async () => {
      const success = searchParams.get("success");
      if (success !== "true") {
        setStatus("error");
        return;
      }

      const payload = {
        type: searchParams.get("type"),
        scheduledAt: searchParams.get("scheduledAt"),
        duration: Number(searchParams.get("duration")),
        trainerId: searchParams.get("trainerId"),
        fee: Number(searchParams.get("fee")),
      };

      try {
        const res = await axios.post(`${url}/api/v1/session/book`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.message === "session created") {
          const sessionId = res.data.session._id;

          const paymentPayload = {
            amount: payload.fee,
            purpose: "Session",
            referenceId: sessionId,
            method: "card",
            transactionId: sessionId,
          };

          await axios.post(`${url}/api/v1/payment/make-payment`, paymentPayload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          await axios.put(
            `${url}/api/v1/session/update-status/${sessionId}`,
            { status: "confirmed", paymentStatus: "success" },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          toast.success("Session Booked Successfully 🎉");
          setStatus("success");

          setTimeout(() => {
            navigate("/user");
          }, 3500);
        } else {
          toast.error("Session booking failed.");
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong during booking.");
        setStatus("error");
      }
    };

    verifyAndBook();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center px-4">
      {status === "loading" && (
        <div className="text-xl font-semibold text-gray-700">
          Finalizing your session booking...
        </div>
      )}

      {status === "success" && (
        <div>
          <CheckCircle className="text-green-600 w-16 h-16 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Session Booked Successfully
          </h1>
          <p className="text-gray-700">Thank you! Redirecting you to dashboard...</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <XCircle className="text-red-600 w-16 h-16 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold text-red-800 mb-2">Booking Failed</h1>
          <p className="text-gray-700">Something went wrong. Please try again.</p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate("/user/bookSessions")}
          >
            Try Again
          </button>
        </div>
      )}

      {/* React Hot Toast */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default SessionSuccess;
