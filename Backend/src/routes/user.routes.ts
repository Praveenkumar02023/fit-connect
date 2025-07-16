import { Router } from "express";
import { deleteUser, getUserById, getUserSessions, Signin, Signup, updateUserProfile , getUserByIdParam} from "../controllers/user.controller";
import { authMiddlware } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";



export const userRouter = Router();

userRouter.post('/signup',Signup);
userRouter.post('/signin',Signin);
userRouter.patch('/update',authMiddlware,upload.single("image"),updateUserProfile);
userRouter.delete('/delete',authMiddlware,deleteUser);

//sessions
userRouter.get('/sessions',authMiddlware,getUserSessions);
userRouter.get('/profile',authMiddlware,getUserById);
userRouter.get('/:id', authMiddlware, getUserByIdParam);


