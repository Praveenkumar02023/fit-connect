import { Router } from "express";
import { authMiddlware } from "../middlewares/auth.middleware";
import { makePayment, userPaymentById, userPayments , getPaymentsByUserId } from "../controllers/payment.controller";

export const paymentRouter = Router();

paymentRouter.post('/make-payment',authMiddlware,makePayment);
paymentRouter.get('/user-payments',authMiddlware,userPayments);
paymentRouter.get('/:id',authMiddlware,userPaymentById);
paymentRouter.get("/user/:userId", getPaymentsByUserId);