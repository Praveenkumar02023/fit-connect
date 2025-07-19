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

  // console.log(who, username, avatar);

  const { token, url } = useContext(StoreContext); // Make sure token and url are provided
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const scrollRef = useRef(null)

  useEffect(()=>{
    scrollRef.current.scrollIntoView({behavior : 'smooth'});
  },[messages])

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
    console.log(user._id);
    const socket = io(url, {
      query: { userId: user._id },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to socket server");

      socket.on("receive-message", ({ from, message }) => {
        console.log("Message received:", message);
        const newMsg = {
          senderId: from,
          receiverId: user._id, // assuming message is to current user
          message,
          createdAt: new Date().toISOString(), // or let backend send it
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
      receiverId: id, // assuming message is to current user
      message,
      createdAt: new Date().toISOString(), // or let backend send it
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
      console.error("Failed to get user:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-blue-50">
      <div className="flex flex-col w-[50vw] h-screen bg-white shadow-2xl rounded-md overflow-hidden border border-gray-300">
        <div className="flex items-center gap-4 px-4 py-2 h-[8vh] border-b border-white/30 bg-white/20 backdrop-blur-md shadow-md">
          <img
            src={avatar}
            alt="client"
            className="w-10 h-10 rounded-full object-cover border border-white/40 shadow"
          />
          <h1 className="text-lg font-semibold text-gray-800 drop-shadow-sm">
            {username}
          </h1>
        </div>

        <div  className="flex-1 bg-gray-100 p-4 overflow-y-auto">
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
                  className={`max-w-xs p-3 rounded-lg shadow-md ${
                    isSender
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{m.message}</p>
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
        <div className="flex items-center gap-2 p-4 bg-white border-t border-gray-200">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md outline-none"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
