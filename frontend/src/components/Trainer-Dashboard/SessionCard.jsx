import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../Context/StoreContext";

const SessionCard = ({
  sessionId,
  scheduledAt,
  type,
  clientName,
  clientImage,
  onRemoveSession,
  meetingLink,
  duration,
}) => {
  const { token, url } = useContext(StoreContext);
  const [meetingStatus, setMeetingStatus] = useState("not_started");
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false); 

  const markCompleteHandler = async () => {
    try {
      await axios.put(
        `${url}/api/v1/session/update-status/${sessionId}`,
        {
          status: "completed",
          paymentStatus: "success",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onRemoveSession(); 
    } catch (error) {
      console.error("Failed to mark session complete:", error);
    }
  };

  useEffect(() => {
    const checkMeetingAvailability = () => {
      const now = new Date();
      const startTime = new Date(scheduledAt);
      const endTime = new Date(startTime.getTime() + duration * 60000);

      if (now < startTime) {
        setMeetingStatus("not_started");
      } else if (now >= startTime && now <= endTime) {
        setMeetingStatus("active");
      } else {
        setMeetingStatus("ended");
        if (!hasMarkedComplete) {
          markCompleteHandler();
          setHasMarkedComplete(true);
        }
      }
    };

    checkMeetingAvailability();
    const interval = setInterval(checkMeetingAvailability, 10000);
    return () => clearInterval(interval);
  }, [scheduledAt, duration, hasMarkedComplete]);

  return (
    <div className="relative transition-transform hover:scale-105 min-w-[300px] max-w-[330px] bg-white/80 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden border border-gray-400 hover:border-blue-400">
      
      {/* Top Banner without Mark Complete */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-3 flex justify-between items-center h-15">
      </div>

      {/* Client Image */}
      <div className="flex justify-center -mt-10">
        <div className="rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-blue-300 shadow relative">
          <img
            src={clientImage}
            className="h-20 w-20 rounded-full border-4 border-white shadow-md"
          />
        </div>
      </div>

      {/* Session Info */}
      <div className="p-5 text-center mt-1">
        <h5 className="font-semibold text-md text-gray-800">
          Client Name : {clientName}
        </h5>
        <p className="text-sm text-gray-500 mt-2">
          <span className="font-medium text-blue-600">{type}</span> Session
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Scheduled At :{" "}
          <span className="text-blue-600 font-medium">{scheduledAt}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Duration:{" "}
          <span className="text-blue-600 font-medium">
            {duration === 30 || duration === 45 ? (
              <span>{duration} mins</span>
            ) : (
              <span>1 hour</span>
            )}
          </span>
        </p>
      </div>

      {/* Meeting Status Display */}
      {meetingStatus === "active" &&  meetingLink  && (
        <div className="text-center">
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 hover:bg-blue-700 text-white text-sm px-6 py-2 shadow transition w-52 mb-2"
          >
            Join Meeting
          </a>
        </div>
      )}

      {meetingStatus === "not_started" && (
        <div className="text-center">
          <p className="inline-block rounded-full border border-gray-400 bg-gray-300 text-black-800 text-sm px-6 py-2 shadow w-52 mb-2 cursor-not-allowed">
            Meeting not started.
          </p>
        </div>
      )}

      {meetingStatus === "ended" && (
        <div className="text-center">
          <p className="inline-block rounded-full bg-red-100 text-red-800 text-sm px-6 py-2 shadow w-52 mb-2 cursor-not-allowed">
            Meeting has ended.
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionCard;
