import { Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";


import { messageModel } from "../models/chat.model";

// -------- Auth Middleware assumes req.userId is set --------
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// -------- sendMessage Controller --------
export const sendMessage = async (req: AuthenticatedRequest, res: Response) : Promise<any> => {
  const senderId = req.userId;
  const { receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ message: "senderId, receiverId, and message are required" });
  }

  try {
    const newMessage = await messageModel.create({ senderId, receiverId, message });
    return res.status(201).json({ message: "Message sent", data: newMessage });
  } catch (err: any) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// -------- getMessages Controller --------
export const getMessages = async (req: AuthenticatedRequest, res: Response)  : Promise<any> => {
  const senderId = req.userId;
  const { receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: "senderId and receiverId are required" });
  }

  try {
    const messages = await messageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (err: any) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
