import { Request, Response } from "express";
import { z } from "zod";
import { Trainer } from "../models/trainer.model";
import { sessionModel } from "../models/training_session.model";

const bookSessionValidator = z.object({
  type: z.enum(["online", "offline"]),
  scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  duration: z.number().min(15).max(180), // duration in minutes
  trainerId: z.string(),
});

export const bookSession = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = (req as any).userId as string;

  const parsed = bookSessionValidator.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.flatten(),
    });
  }

  const { type, scheduledAt, duration, trainerId } = parsed.data;

  try {
    const trainer = await Trainer.findOne({ _id: trainerId });

    if (!trainer) {
      throw new Error("Trainer not found");
    }

    const fee = trainer.pricing_perSession;

    const session = await sessionModel.create({
      type,
      scheduledAt,
      duration,
      fee,
      clientId: userId,
      trainerId,
      paymentStatus: "pending",
      status: "pending",
    });

    if (!session) {
      throw new Error("Error creating session");
    }

    res.status(200).json({ message: "session created", session });
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message || "something went wrong" });
  }
};

const cancelSessionValidator = z.object({
    sessionId : z.string(),
})

export const cancelSession = async(req : Request,res:Response) : Promise<any> =>{

    const userId = (req as any).userId as string;

    const parsed = cancelSessionValidator.safeParse(req.body)

    if(!parsed.success){

        return res.status(400).json({message : "Session not found"});

    }

    const sessionId = parsed.data.sessionId;


    try {
        
        const updatedSession = await sessionModel.updateOne({_id : sessionId} ,{status : "cancelled"});

        if(!updatedSession.matchedCount){
            throw new Error("Session not found");
        }

        res.status(200).json({message : "Session cancelled"});

    } catch (error) {

        res.status(500).json({message : (error as Error).message || "Something went wrong"});

    }

}

export const getSessionById = async(req : Request,res : Response)=>{

  const sessionId = req.params.id;
 
  console.log(sessionId);
  
  try {
    
    const session = await sessionModel.findOne({_id : sessionId});

    if(!session){
      throw new Error("Session not found");
    }

    res.status(200).json({message : "session found",session});

  } catch (error) {
      res.status(500).json({message : (error as Error).message || "Something went Wrong"});
  }

}