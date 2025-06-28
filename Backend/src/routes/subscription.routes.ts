import { Router } from "express";
import { authMiddlware } from "../middlewares/auth.middleware";
import { cancelSubscription, createSubscription, getAllSubscription, viewSubscription } from "../controllers/subscription.controller";

export const subscriptionRouter = Router();


subscriptionRouter.post('/subscribe',authMiddlware,createSubscription);
subscriptionRouter.post('/cancel',authMiddlware,cancelSubscription);
subscriptionRouter.get('/view/:id',authMiddlware,viewSubscription);
subscriptionRouter.get('/all',authMiddlware,getAllSubscription);