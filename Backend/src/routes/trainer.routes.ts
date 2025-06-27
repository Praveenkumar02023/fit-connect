import { Router } from "express";

import { authMiddlware } from "../middlewares/auth.middleware";
import { getTrainerById, Signin, Signup, updateTrainerProfile } from "../controllers/trainer.controller";

export const trainerRouter = Router();

trainerRouter.post('/signup',Signup);
trainerRouter.post('/signin',Signin);


trainerRouter.get('/:id',authMiddlware,getTrainerById);
trainerRouter.patch('/update',authMiddlware,updateTrainerProfile)

