import { Router } from "express";
import { authMiddlware } from "../middlewares/auth.middleware";
import { bookSession, cancelSession, createStripeSession, getAllSession, getSessionById, updateSessionStatus } from "../controllers/session.controller";

export const sessionRouter = Router();

sessionRouter.post('/book',authMiddlware,bookSession);
sessionRouter.post('/cancel',authMiddlware,cancelSession);
sessionRouter.get('/all',authMiddlware,getAllSession);
sessionRouter.post('/createstripesession', authMiddlware, createStripeSession);
sessionRouter.put("/update-status/:id",authMiddlware, updateSessionStatus);
sessionRouter.get('/:id',authMiddlware,getSessionById);
