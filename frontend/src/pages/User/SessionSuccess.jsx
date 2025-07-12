import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { ToastContainer, toast } from 'react-toastify';

const SessionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, url } = useContext(StoreContext);

  useEffect(() => {
    const verifyAndBook = async () => {
      const success = searchParams.get("success");
      if (success !== "true") {
        alert("Payment failed or cancelled");
        return navigate("/user/bookSessions");
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
        toast.success("Session Booked Successfully 🎉");
        setTimeout(() => {
          navigate("/user");
        }, 3500); 
      } else {
        alert("Something went wrong during booking");
      }
    } catch (err) {
      console.error(err);
      alert("Booking creation failed");
    }
  };

  verifyAndBook();
}, []);
   return (
    <div className="text-center mt-10 text-xl">
      <ToastContainer />
    </div>
  );
};

export default SessionSuccess;
