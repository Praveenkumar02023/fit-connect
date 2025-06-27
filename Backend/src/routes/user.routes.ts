import { Router } from "express";
import { deleteUser, getUserById, Signin, Signup, updateUserProfile } from "../controllers/user.controller";
import { authMiddlware } from "../middlewares/auth.middleware";

export const userRouter = Router();

userRouter.post('/signup',Signup);
userRouter.post('/signin',Signin);
userRouter.get('/:id',authMiddlware,getUserById);

userRouter.patch('/update',authMiddlware,updateUserProfile);
userRouter.delete('delete',authMiddlware,deleteUser);
