import { Router } from "express";
import { deleteUser, getUserById, getUserSessions, Signin, Signup, updateUserProfile, getUsersById } from "../controllers/user.controller";
import { authMiddlware } from "../middlewares/auth.middleware";


export const userRouter = Router();

userRouter.post('/signup',Signup);
userRouter.post('/signin',Signin);
userRouter.patch('/update',authMiddlware,updateUserProfile);
userRouter.delete('/delete',authMiddlware,deleteUser);

//sessions
userRouter.get('/sessions',authMiddlware,getUserSessions);
userRouter.get('/profile',authMiddlware,getUserById);
