import {z} from 'zod'
import { Request , Response } from 'express';
import { userModel } from '../models/user.model';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { parse } from 'path';
import { hash } from 'crypto';


const signupValidator = z.object({

    firstName : z.string(),
    lastName : z.string(),
    email : z.string().email(),
    password : z.string()

});

const signinValidator = z.object({
    email : z.string().email(),
    password : z.string()
});


export const Signup = async (req: Request, res: Response): Promise<any> => {
  const parsed = signupValidator.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid inputs :(" });
  }

  const { firstName, lastName, email, password } = parsed.data;

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    res.status(201).json({
      message: "Sign Up successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Signin = async (req: Request, res: Response): Promise<any> => {
  const parsed = signinValidator.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid inputs :(" });
  }

  const { email, password } = parsed.data;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isVerified = await bcrypt.compare(password, user.password);

    if (!isVerified) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    res.status(200).json({
      message: "Signin successful.",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) : Promise<any> => {
  const userId = (req as any).userId as string;

  if (!userId) {
    return res.status(400).json({ message: "User ID not provided" });
  }

  try {
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfileValidator = z.object({
  firstName : z.string().optional(),
  lastName : z.string().optional(),
  password : z.string().optional()
});

export const updateUserProfile = async(req : Request , res : Response) : Promise<any> =>{

  const userId = (req as any).userId as string;

  const parsed = updateProfileValidator.safeParse(req.body);

  if(!parsed.success){

    return res.status(400).json({message : "Invalid inputs :("});

  }

  try {
    
    const {password} = parsed.data;

    if(password){

      const hashedPassword = await bcrypt.hash(password,10);
      parsed.data.password = hashedPassword;

    }

    const updatedUser = await userModel.updateOne({_id : userId},parsed.data);

    if(!updatedUser){
      throw new Error("User not found");
    }
    
    res.status(200).json({message : "User details updated!",updatedUser});

  } catch (e) {

    res.status(500).json({message : (e as Error).message});

  }

}

export const deleteUser = async(req : Request , res : Response) => {

  const userId = (req as any).userId as string;

  try {

    const deletedUser = await userModel.deleteOne({_id : userId});

    if (deletedUser.deletedCount === 0) {
      throw new Error("User not found");
    }

    res.status(200).json({message : "User deleted!"});

  } catch (error) {
    res.status(500).json({message : (error as Error).message});
  } 

}