import { Router } from "express";
import { authMiddlware } from "../middlewares/auth.middleware";
import { createEvent, deleteEvent, deleteRegistration, getAllEvents, getAllParticipants, getEventById, getUserRegisteredEvents, registerEvent, updateEvent  , createStripeSession , checkEventRegistration, getTrainerEvents , getEventParticipants} from "../controllers/event.contoller";
import upload from "../middlewares/multer.middleware";

export const eventRouter = Router();

//related to events
eventRouter.post('/create',authMiddlware,upload.single("image"),createEvent);
eventRouter.get('/all',getAllEvents);
eventRouter.patch('/update',authMiddlware,upload.single("image"),updateEvent);
eventRouter.post('/delete',authMiddlware,deleteEvent);

//related to event participants.
eventRouter.post('/register',authMiddlware,registerEvent);
eventRouter.post('/cancel',authMiddlware,deleteRegistration);
eventRouter.post('/all-participants',authMiddlware,getAllParticipants);
eventRouter.post('/UserRegisteredEvents' , authMiddlware , getUserRegisteredEvents)
eventRouter.post('/checkout-stripe-session' , authMiddlware , createStripeSession)
eventRouter.post('/register-check', authMiddlware, checkEventRegistration);
eventRouter.get('/trainer' , authMiddlware , getTrainerEvents);
eventRouter.get("/:eventId/participants", authMiddlware, getEventParticipants);
eventRouter.get('/:id',authMiddlware,getEventById);

