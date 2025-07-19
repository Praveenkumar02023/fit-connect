import React, { useContext, useEffect, useRef, useState } from 'react';
import Button from './ui/Button';
import { io } from 'socket.io-client';
import axios from 'axios';
import { StoreContext } from '../Context/StoreContext';
import { useLocation, useParams } from 'react-router-dom';

const Chat = () => {

  const {id} = useParams();
  const location = useLocation();
  const who = location.state.who
  console.log(who);
  

  const { token, url } = useContext(StoreContext); // Make sure token and url are provided
  const [user, setUser] = useState(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if(who == "trainer"){
      getUser()
    }else{
      getTrainer()
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    console.log(user._id);
    const socket = io(url, {
      query: { userId: user._id },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket server');

      socket.on('receive-message', ({ from, message }) => {
        console.log('Message received:', message);
        // You can update local state here to display messages
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

    socketRef.current.emit('private-message', {
      to: id,
      message,
    });

    inputRef.current.value = '';
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
      console.error('Failed to get user:', error);
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
      console.error('Failed to get user:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="flex flex-col w-[50vw] h-screen bg-white shadow-2xl rounded-md overflow-hidden border border-gray-300">
        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
          {/* You can display messages here */}
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
