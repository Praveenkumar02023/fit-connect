import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Footer from "../LandingPage/Footer";

const MyTrainers = () => {
  const { token, url } = useContext(StoreContext);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscribedTrainers();
    fetchUser();
  }, []);

  const fetchSubscribedTrainers = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/subscription/my-trainers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setTrainers(res.data.trainers);
        
        
      }
    } catch (err) {
      console.error("Failed to fetch subscribed trainers:", err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const selectTrainer = async (trainer) => {
    setSelectedTrainer(trainer);
    try {
      const res = await axios.post(
        `${url}/api/v1/message/get`,
        { receiverId: trainer._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data.messages);
      setupSocket(user?._id);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const setupSocket = (userId) => {
    if (!userId) return;
    const socket = io(url, {
      query: { userId },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.on("receive-message", ({ from, message }) => {
        setMessages((prev) => [
          ...prev,
          {
            senderId: from,
            receiverId: userId,
            message,
            createdAt: new Date().toISOString(),
          },
        ]);
      });
    });
  };

  const sendMessage = () => {
    if (!inputRef.current || !socketRef.current || !user || !selectedTrainer) return;

    const message = inputRef.current.value.trim();
    if (!message) return;

    socketRef.current.emit("private-message", {
      to: selectedTrainer._id,
      message,
    });

    setMessages((prev) => [
      ...prev,
      {
        senderId: user._id,
        receiverId: selectedTrainer._id,
        message,
        createdAt: new Date().toISOString(),
      },
    ]);
    inputRef.current.value = "";
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
   <div className="flex flex-col " >
    <div className="h-[1vh]  bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100" >

    </div>
     <div className="min-h-[92vh] overflow-hidden flex flex-col bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-6xl mx-auto flex-grow mt-6">
        <div className="flex rounded-lg overflow-hidden border border-gray-300 bg-white shadow-lg h-[80vh]">
          {/* Trainer List */}
          <div className="w-[30%] border-r border-gray-200 overflow-y-auto">
            <h2 className="text-lg font-semibold px-4 py-3 border-b bg-gray-100">
              My Trainers
            </h2>
            {trainers.length === 0 ? (
              <p className="px-4 py-6 text-gray-500 text-center">No subscriptions yet.</p>
            ) : (
              trainers.map((trainer) => (
                <div
                  key={trainer._id}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer ${
                    selectedTrainer?._id === trainer._id ? "bg-blue-100" : ""
                  }`}
                  onClick={() => selectTrainer(trainer)}
                >
                  <img
                    src={
                      trainer.avatar ||
                      "https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                    }
                    className="w-10 h-10 rounded-full object-cover border"
                    alt="avatar"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {trainer.firstName} {trainer.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {trainer.speciality?.[0] || "Trainer"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Area */}
          <div className="w-[70%] flex flex-col justify-between">
            {selectedTrainer ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-4 px-4 py-3 border-b">
                  <img
                    onClick={() => navigate(`/user/trainers/${selectedTrainer._id}`)}
                    src={selectedTrainer.avatar}
                    className="cursor-pointer w-10 h-10 rounded-full object-cover border"
                    alt="trainer"
                  />
                  <h1 className="text-md font-semibold text-gray-800">
                    {selectedTrainer.firstName} {selectedTrainer.lastName}
                  </h1>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {messages.map((msg, idx) => {
                    const isSender = msg.senderId === user?._id;
                    return (
                      <div
                        key={idx}
                        className={`flex ${
                          isSender ? "justify-end" : "justify-start"
                        } mb-2`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg shadow text-sm ${
                            isSender
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-gray-200 text-gray-900 rounded-bl-none"
                          }`}
                        >
                          <p>{msg.message}</p>
                          <span className="text-[10px] block mt-1 text-right opacity-60">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={scrollRef}></div>
                </div>

                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-t">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
                <p>Select a trainer to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
    </div>
   </div>
  );
};

export default MyTrainers;
