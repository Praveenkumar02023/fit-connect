import { Router } from "express";
import { authMiddlware } from "../middlewares/auth.middleware";
<<<<<<< HEAD
import { createEvent, deleteEvent, deleteRegistration, getAllEvents, getAllParticipants, getEventById, getUserRegisteredEvents, registerEvent, updateEvent  , createStripeSession} from "../controllers/event.contoller";
import upload from "../middlewares/multer.middleware";

export const eventRouter = Router();

//related to events
eventRouter.post('/create',authMiddlware,upload.single("image"),createEvent);
eventRouter.get('/all',authMiddlware,getAllEvents);
=======

import { createEvent, deleteEvent, deleteRegistration, getAllEvents, getAllParticipants, getEventById, getUserRegisteredEvents, registerEvent, updateEvent } from "../controllers/event.contoller";
import upload from "../middlewares/multer.middleware";
import { createStripeSession } from "../controllers/session.controller";

export const eventRouter = Router();




eventRouter.post('/create',authMiddlware,upload.single("image"),createEvent);
eventRouter.get('/all',authMiddlware,getAllEvents);

>>>>>>> upstream/main
eventRouter.get('/:id',authMiddlware,getEventById);
eventRouter.patch('/update',authMiddlware,updateEvent);
eventRouter.post('/delete',authMiddlware,deleteEvent);

//related to event participants.
eventRouter.post('/register',authMiddlware,registerEvent);
eventRouter.post('/cancel',authMiddlware,deleteRegistration);
eventRouter.post('/all-participants',authMiddlware,getAllParticipants);
eventRouter.post('/UserRegisteredEvents' , authMiddlware , getUserRegisteredEvents)
eventRouter.post('/checkout-stripe-session' , authMiddlware , createStripeSession)
