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



  const { firstName, lastName, email, password  } = parsed.data;


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
      pricing_perMonth : 0,
      pricing_perSession : 0,
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
  const trainerId = req.params.id;

  if (!trainerId) {
    return res.status(400).json({ message: "User ID not provided" });
  }

  try {
    const trainer = await Trainer.findById(trainerId).select("-password");

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json({ trainer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message:  (error as Error).message || "Internal server error" });
  }
};

const updateTrainerValidator = z.object({
  firstName : z.string().optional(),
  lastName : z.string().optional(),
  password : z.string().optional(),
  experience : z.string().optional(),
  pricing_perSession : z.number().optional(),
  pricing_perMonth : z.number().optional(),
  speciality : z.array(z.string()).optional(),
  about : z.string().optional(),
  rating : z.string().optional(),
  Achievements : z.string().optional()
});

export const updateTrainerProfile = async (req: Request, res: Response): Promise<any> => {
  const trainerId = (req as any).userId as string;

  // 🔧 Convert req.body types before Zod
  if (typeof req.body.pricing_perSession === "string") {
    req.body.pricing_perSession = Number(req.body.pricing_perSession);
  }

  if (typeof req.body.pricing_perMonth === "string") {
    req.body.pricing_perMonth = Number(req.body.pricing_perMonth);
  }

  if (typeof req.body.speciality === "string") {
    try {
      req.body.speciality = JSON.parse(req.body.speciality);
    } catch (e) {
      req.body.speciality = req.body.speciality.split(",").map((s : string) => s.trim());
    }
  }

  const parsed = updateTrainerValidator.safeParse(req.body);
  if (!parsed.success) {
    console.error(parsed.error.format()); // helpful for debugging
    return res.status(500).json({ message: "Invalid inputs" });
  }

  const { password } = parsed.data;

  if (req.file?.path) {
    (parsed.data as any).avatar = req.file.path;
  }

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      parsed.data.password = hashedPassword;
    }

    const acknowledge = await Trainer.updateOne({ _id: trainerId }, parsed.data);

    if (!acknowledge.matchedCount) {
      throw new Error("Trainer not found");
    }

    const updatedTrainer = await Trainer.find({ _id: trainerId });
    res.status(200).json({ message: "Trainer details updated!", acknowledge, updatedTrainer });

  } catch (error) {
    res.status(400).json({ message: (error as Error).message || "Something went wrong" });
  }
};


export const getAllTrainers = async (req: Request, res: Response): Promise<any> => {
  try {
    const trainers = await Trainer.find().select("-password"); 
    res.status(200).json({ trainers });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ message: "Failed to fetch trainers" });
  }
};
export const getTrainerProfile = async (req: Request, res: Response) : Promise<any> => {
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
