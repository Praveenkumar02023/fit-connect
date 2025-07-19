import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/message.controller";
import { authMiddlware } from "../middlewares/auth.middleware";

export const messageRouter = Router();

messageRouter.post('/send',authMiddlware,sendMessage);
messageRouter.post('/get',authMiddlware,getMessages)