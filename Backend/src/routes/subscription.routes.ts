import { Router } from "express";
import { authMiddlware } from "../middlewares/auth.middleware";
import { cancelSubscription, createSubscription, getAllSubscription, viewSubscription, getTrainerSubscription, getTrainers } from "../controllers/subscription.controller";
import { createStripeSession } from "../controllers/subscription.controller";

export const subscriptionRouter = Router();


subscriptionRouter.post('/subscribe',authMiddlware,createSubscription);
subscriptionRouter.post('/cancel',authMiddlware,cancelSubscription);
subscriptionRouter.get('/all',authMiddlware,getAllSubscription);


subscriptionRouter.post("/checkout-stripe-session" , authMiddlware , createStripeSession)
subscriptionRouter.get('/trainer',authMiddlware,getTrainerSubscription);
subscriptionRouter.get("/my-trainers", authMiddlware, getTrainers)
subscriptionRouter.get('/:id',authMiddlware,viewSubscription);
// Route: GET /api/v1/subscription/my-trainers
