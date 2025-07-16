import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";

const SessionCard = ({ sessionId, scheduledAt, type, clientName, clientImage, onStatusUpdate }) => {
  const { token, url } = useContext(StoreContext);

  const markCompleteHandler = async () => {
    try {
      await axios.put(
        `${url}/api/v1/session/update-status/${sessionId}`,
        {
          status: "completed",
          paymentStatus: "paid",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onStatusUpdate?.(); // Optional callback
    } catch (error) {
      console.error("Failed to mark session complete:", error);
    }
  };

  return (
    <div className="relative transition-transform hover:scale-105 min-w-[260px] max-w-[280px] bg-white/80 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-400">
      
      {/*Top Banner */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-3 flex justify-between items-center relative">
        <div className="text-sm font-semibold text-gray-700"> </div>

        {/* Mark Complete Button */}
        <button
          onClick={markCompleteHandler}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full shadow hover:bg-blue-700 transition"
        >
          Mark Complete
        </button>
      </div>

      {/* Client Image Overlapping */}
      <div className="flex justify-center -mt-10">
        <div className="rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-blue-300 shadow">
          <img
            src={clientImage}
            alt={clientName}
            className="h-20 w-20 rounded-full border-4 border-white shadow-md"
          />
        </div>
      </div>

      {/* Session Info */}
      <div className="p-5 text-center mt-2">
        <h3 className="font-semibold text-xl text-gray-800">{clientName}</h3>
        <p className="text-sm text-gray-500 mt-2">
          <span className="font-medium text-blue-600">{type}</span> Session
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Scheduled At : <span className="text-blue-600 font-medium">{scheduledAt}</span>
        </p>
      </div>
    </div>
  );
};

export default SessionCard;
