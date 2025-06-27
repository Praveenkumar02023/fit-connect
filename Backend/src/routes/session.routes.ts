import { Router } from "express";
import { authMiddlware } from "../middlewares/auth.middleware";
import { bookSession, cancelSession } from "../controllers/session.controller";

export const sessionRouter = Router();

sessionRouter.post('/book',authMiddlware,bookSession);
sessionRouter.get('/cancel',authMiddlware,cancelSession);