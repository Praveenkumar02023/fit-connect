import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { ToastContainer, toast } from "react-toastify";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, url } = useContext(StoreContext);

  useEffect(() => {
    const verifyAndBuy = async () => {
      const success = searchParams.get("success");
      if (success !== "true") {
        alert("Payment failed or cancelled");
        return navigate("/user/buySubscription");
      }

      const amount = searchParams.get("amount");

      const payload = {
        trainerId: searchParams.get("trainerId"),
      };
      try {
        const res = await axios.post(`${url}/api/v1/subscription/subscribe`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.message === "subscribed!") {
          const subscriptionId = res.data.newSubscription._id;

          const paymentPayload = {
            amount: Number (amount),
            purpose: "Subscription",
            referenceId: subscriptionId,
            method: "card",
            transactionId: subscriptionId,
          };

          await axios.post(`${url}/api/v1/payment/make-payment`, paymentPayload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          toast.success("Subscribed Successfully 🎉");
          setTimeout(() => {
            navigate("/user/subscriptions");
          }, 3500);
        } else {
          alert("Something went wrong");
        }
      } catch (err) {
        console.error(err);
        alert("Booking creation failed");
      }
    };

    verifyAndBuy();
  }, []);

  return (
    <div>
      <div className="text-center mt-10 text-xl">
        <ToastContainer />
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
