import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import { io } from "socket.io-client";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";
import { useLocation, useParams } from "react-router-dom";

const Chat = () => {
  const { id } = useParams();
  const location = useLocation();
  const { who, username, avatar } = location.state;

  const { token, url } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (who == "trainer") {
      getUser();
    } else {
      getTrainer();
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.post(
          `${url}/api/v1/message/get`,
          { receiverId: id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    if (user && id) {
      fetchMessages();
    }
  }, [user, id]);

  useEffect(() => {
    if (!user) return;
    const socket = io(url, {
      query: { userId: user._id },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.on("receive-message", ({ from, message }) => {
        const newMsg = {
          senderId: from,
          receiverId: user._id,
          message,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMsg]);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const sendMessage = () => {
    if (!inputRef.current || !socketRef.current || !user) return;

    const message = inputRef.current.value.trim();
    if (!message) return;

    socketRef.current.emit("private-message", {
      to: id,
      message,
    });

    const newMsg = {
      senderId: user._id,
      receiverId: id,
      message,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    inputRef.current.value = "";
  };

  const getUser = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Failed to get user:", error);
    }
  };

  const getTrainer = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/trainer/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setUser(res.data.trainer);
      }
    } catch (error) {
      console.error("Failed to get trainer:", error);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-100 via-white to-blue-50 overflow-hidden">
      {/* Bubble Effects */}
      <div className="absolute w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse z-0"></div>
      <div className="absolute w-32 h-32 bg-pink-300 rounded-full blur-2xl opacity-30 bottom-16 right-16 animate-pulse z-0"></div>
      <div className="absolute w-28 h-28 bg-purple-200 rounded-full blur-2xl opacity-20 bottom-1/4 left-[30%] animate-pulse z-0"></div>
      <div className="absolute w-24 h-24 bg-green-200 rounded-full blur-2xl opacity-20 top-1/3 right-1/4 animate-pulse z-0"></div>

      {/* Chat Container */}
      <div className="relative z-10 max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col h-[80vh] bg-white rounded-lg shadow-lg border border-gray-200">
          {/* Header */}
          <div className="flex items-center gap-4 px-4 py-3 border-b bg-white shadow-sm rounded-t-lg">
            <img
              src={
                avatar ||
                "https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg?nii=t"
              }
              alt="client"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
            <h1 className="text-lg font-medium text-gray-800">{username}</h1>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((m, idx) => {
              const isSender = m.senderId === user._id;
              return (
                <div
                  key={idx}
                  className={`flex ${
                    isSender ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg shadow-sm text-sm ${
                      isSender
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <p>{m.message}</p>
                    <span className="text-[10px] opacity-70 block mt-1 text-right">
                      {new Date(m.createdAt).toLocaleTimeString([], {
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

          {/* Input Box */}
          <div className="flex items-center gap-3 px-4 py-3 border-t bg-white rounded-b-lg">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Button
              onClick={sendMessage}
              className="px-4 py-2 text-sm font-medium"
            >
              Send
            </Button>
          </div>
        </div>
        <footer className="relative text-xs text-gray-400 text-center py-4 z-10">
          © 2025 FitConnect. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Chat;
