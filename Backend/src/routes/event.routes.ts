import { Router } from "express";
import { authMiddlware } from "../middlewares/auth.middleware";
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from "../controllers/event.contoller";

export const eventRouter = Router();

eventRouter.post('/create',authMiddlware,createEvent);
eventRouter.get('/all',authMiddlware,getAllEvents);
eventRouter.get('/:id',authMiddlware,getEventById);
eventRouter.patch('/update',authMiddlware,updateEvent);
eventRouter.post('/delete',authMiddlware,deleteEvent);