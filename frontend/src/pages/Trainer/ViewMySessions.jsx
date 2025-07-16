import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import SessionCard from "../../components/Trainer-Dashboard/SessionCard"; 
import { StoreContext } from "../../Context/StoreContext";

const TrainerSessionsPage = () => {
  const { token, url } = useContext(StoreContext);
  const [sessions, setSessions] = useState([]);

  const fetchTrainerSessions = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/trainer/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sessionsWithTrainer = await Promise.all(
        res.data.allSessions.map(async (session) => {
          try {
            const UserRes = await axios.get(`${url}/api/v1/user/${session.clientId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const user = UserRes.data.user;
            return {
              ...session,
              clientName: `${user.name}`,
              clientImage: `${user.avatar}`,
            };
          } catch (err) {
            console.error("fetch failed", err);
            return session;
          }
        })
      );
      const upcomingSessions = sessionsWithTrainer.filter(
        (session) => session.status === "confirmed"
      );

      setSessions(upcomingSessions);
    } catch (error) {
      console.log("Error in fetching sessions", error);
    }
  };

  useEffect(() => {
    fetchTrainerSessions();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-5">
      <div className="bg-gradient-to-r bg-blue-400 to-blue-600 min-h-10 mb-10">
        <h2 className="text-2xl font-bold text-white mb-10 text-center">Your Upcoming Sessions</h2>
      </div>

      {sessions.length === 0 ? (
        <p className="text-gray-500 text-center">No sessions booked yet.</p>
      ) : (
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            const formattedDate = new Date(session.scheduledAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <SessionCard
                key={session._id}
                sessionId={session._id}
                scheduledAt={formattedDate}
                type={session.type}
                clientName={session.clientName || "Client"}
                clientImage={session.clientImage || "/default-profile.png"}
               onRemoveSession={() => setSessions(prev => prev.filter(s => s._id !== session._id))}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrainerSessionsPage;
