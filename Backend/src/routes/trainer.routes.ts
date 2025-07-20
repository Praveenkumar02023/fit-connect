import { Router } from "express";

import { authMiddlware } from "../middlewares/auth.middleware";
import { getTrainerById, Signin, Signup, updateTrainerProfile , getTrainerProfile} from "../controllers/trainer.controller";
import { getTrainerSessions } from "../controllers/user.controller";
import { getAllTrainers } from "../controllers/trainer.controller";
import upload from "../middlewares/multer.middleware";

export const trainerRouter = Router();

trainerRouter.post('/signup',Signup);
trainerRouter.post('/signin',Signin);


trainerRouter.patch('/update',authMiddlware,upload.single("image"),updateTrainerProfile)
trainerRouter.get('/sessions',authMiddlware,getTrainerSessions);
trainerRouter.get('/profile' , authMiddlware ,getTrainerProfile);
trainerRouter.get('/:id' , authMiddlware ,getTrainerById);
trainerRouter.get("/", getAllTrainers);


