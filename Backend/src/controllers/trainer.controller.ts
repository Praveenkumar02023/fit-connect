import {z} from 'zod'
import { Request , Response } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Trainer } from '../models/trainer.model';
import { log } from 'console';


const signupValidator = z.object({

    firstName : z.string(),
    lastName : z.string(),
    email : z.string().email(),
    password : z.string(),
    pricing_perSession : z.coerce.number(),
    pricing_perMonth: z.coerce.number()

});

const signinValidator = z.object({
    email : z.string().email(),
    password : z.string()
});


export const Signup = async (req: Request, res: Response): Promise<any> => {

  const parsed = signupValidator.safeParse(req.body);
  console.log(req.body);
  
  if (!parsed.success) {
    return res.status(400).json({ 
      message: "Invalid inputs :(",
      errors: parsed.error.errors // <-- 
    });
  }

  const { firstName, lastName, email, password  , pricing_perMonth , pricing_perSession } = parsed.data;

  try {
    const existingTrainer = await Trainer.findOne({ email });

    if (existingTrainer) {
      return res.status(409).json({ message: "Trainer already exists" });
    }
    console.log(password);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    
    const newTrainer = await Trainer.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      pricing_perMonth,
      pricing_perSession
    });

    const token = jwt.sign({ userId: newTrainer._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    res.status(201).json({
      message: "Sign Up successful",
      token,
      newTrainer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Signin = async (req: Request, res: Response): Promise<any> => {
  const parsed = signinValidator.safeParse(req.body);
  log(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid inputs :(" });
  }

  const { email, password } = parsed.data;

  try {
    const trainer = await Trainer.findOne({ email });

    if (!trainer) {
      return res.status(404).json({ message: "User not found" });
    }

    const isVerified = await bcrypt.compare(password, trainer.password);
    console.log(trainer.password);
    
    if (!isVerified) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: trainer._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    res.status(200).json({
      message: "Signin successful.",
      token,
      trainer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTrainerById = async (req: Request, res: Response) : Promise<any> => {
  const trainerId = (req as any).userId as string;

  if (!trainerId) {
    return res.status(400).json({ message: "User ID not provided" });
  }

  try {
    const trainer = await Trainer.findById(trainerId).select("-password");

    if (!trainer) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ trainer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTrainerValidator = z.object({
  firstName : z.string().optional(),
  lastName : z.string().optional(),
  password : z.string().optional(),
  experience : z.string().optional(),
  pricing_perSession : z.number().optional(),
  pricing_perMonth : z.number().optional(),
  speciality : z.array(z.string()).optional()
});

export const updateTrainerProfile = async(req : Request,res : Response) : Promise<any> =>{

  const trainerId = (req as any).userId as string;

  const parsed = updateTrainerValidator.safeParse(req.body);

  if(!parsed.success){

    return res.status(500).json({message : "Invalid inputs"});

  }

  const {password} = parsed.data;

  

  try {

    if(password){

    const hashedPassword = await bcrypt.hash(password,10);  
    parsed.data.password = hashedPassword;

  }
    const updatedTrainer = await Trainer.updateOne({_id : trainerId },parsed.data);

    if(!updatedTrainer.matchedCount){
      throw new Error("Trainer not found");
    } 

    res.status(200).json({message : "Trainer details updated!",updatedTrainer});

  } catch (error) {

      res.status(400).json({message : (error as Error).message || "Something went wrong"});

  }

}