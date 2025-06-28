import { Router } from "express";
import { authMiddlware } from "../middlewares/auth.middleware";
import { createEvent, deleteEvent, deleteRegistration, getAllEvents, getAllParticipants, getEventById, registerEvent, updateEvent } from "../controllers/event.contoller";

export const eventRouter = Router();

//related to events
eventRouter.post('/create',authMiddlware,createEvent);
eventRouter.get('/all',authMiddlware,getAllEvents);
eventRouter.get('/:id',authMiddlware,getEventById);
eventRouter.patch('/update',authMiddlware,updateEvent);
eventRouter.post('/delete',authMiddlware,deleteEvent);

//related to event participants.
eventRouter.post('/register',authMiddlware,registerEvent);
eventRouter.post('/cancel',authMiddlware,deleteRegistration);
eventRouter.post('/all-participants',authMiddlware,getAllParticipants);
