import { Router } from "express";
import { authMiddlware } from "../middlewares/auth.middleware";
import { cancelSubscription, createSubscription, getAllSubscription, viewSubscription } from "../controllers/subscription.controller";
import { createStripeSession } from "../controllers/subscription.controller";

export const subscriptionRouter = Router();


subscriptionRouter.post('/subscribe',authMiddlware,createSubscription);
subscriptionRouter.post('/cancel',authMiddlware,cancelSubscription);
subscriptionRouter.get('/all',authMiddlware,getAllSubscription);
subscriptionRouter.get('/:id',authMiddlware,viewSubscription);

subscriptionRouter.post("/checkout-stripe-session" , authMiddlware , createStripeSession)