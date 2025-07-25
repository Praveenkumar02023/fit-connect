import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { CheckCircle, XCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, url } = useContext(StoreContext);

  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'

  useEffect(() => {
    const verifyAndSubscribe = async () => {
      const success = searchParams.get("success");
      const amount = searchParams.get("amount");
      const trainerId = searchParams.get("trainerId");

      if (success !== "true" || !trainerId || !amount) {
        setStatus("error");
        return;
      }

      try {
        // Subscribe the user
        const res = await axios.post(
          `${url}/api/v1/subscription/subscribe`,
          { trainerId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.message === "subscribed!") {
          const subscriptionId = res.data.newSubscription._id;

          const paymentPayload = {
            amount: Number(amount),
            purpose: "Subscription",
            referenceId: subscriptionId,
            method: "card",
            transactionId: subscriptionId,
          };

          await axios.post(`${url}/api/v1/payment/make-payment`, paymentPayload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          toast.success("Subscribed Successfully 🎉");
          setStatus("success");

          setTimeout(() => {
            navigate("/user/subscriptions");
          }, 3500);
        } else {
          toast.error("Subscription failed.");
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong during subscription.");
        setStatus("error");
      }
    };

    verifyAndSubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center px-4">
      {status === "loading" && (
        <div className="text-xl font-semibold text-gray-700">Processing your subscription...</div>
      )}

      {status === "success" && (
        <div>
          <CheckCircle className="text-green-600 w-16 h-16 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold text-green-800 mb-2">Subscription Successful</h1>
          <p className="text-gray-700">Thank you! Redirecting to your subscriptions...</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <XCircle className="text-red-600 w-16 h-16 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold text-red-800 mb-2">Subscription Failed</h1>
          <p className="text-gray-700">Something went wrong. Redirecting you back...</p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate("/user/buySubscription")}
          >
            Go Back
          </button>
        </div>
      )}

      {/* React Hot Toast */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default SubscriptionSuccess;
