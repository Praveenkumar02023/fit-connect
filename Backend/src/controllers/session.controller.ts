import { Request, Response } from "express";
import { z } from "zod";
import { Trainer } from "../models/trainer.model";
import { sessionModel } from "../models/training_session.model";
import mongoose from "mongoose";
import Stripe from "stripe";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set.");
}
const stripe = new Stripe(stripeSecretKey);
const frontend_url = process.env.FRONTEND_URL;

const generateMeetingLink = (trainerId: string) => {
  return `https://meet.jit.si/FitConnect-${trainerId}-${Date.now()}`;
};


const bookSessionValidator = z.object({
  type: z.string(),
  scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  duration: z.number().min(15).max(180), // duration in minutes
  trainerId: z.string(),
  fee: z.number().min(0, "Fee must be a positive number"),
});
const updateSessionStatusValidator = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
  paymentStatus: z.enum(["pending", "success", "failed"]),
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

  const { type, scheduledAt, duration, trainerId, fee } = parsed.data;

  try {
    const trainer = await Trainer.findOne({ _id: trainerId });

    if (!trainer) {
      throw new Error("Trainer not found");
    }
    const meetingLink = generateMeetingLink(trainerId);


    const session = await sessionModel.create({
      type,
      scheduledAt,
      duration,
      fee,
      clientId: userId,
      trainerId,
      paymentStatus: "pending",
      status: "pending",
      meetingLink
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

export const getAllSession = async(req : Request,res : Response)=>{

  const userId = (req as any).userId as string;

  try {
    
    const Allsession = await sessionModel.find({ clientId : userId });

    if(!Allsession){
      throw new Error("Session not found");
    }

    res.status(200).json({message : "session found",Allsession});

  } catch (error) {
      res.status(500).json({message : (error as Error).message || "Something went Wrong"});
  }

}
export const createStripeSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, scheduledAt, duration, trainerId, fee } = req.body;
    const userId = (req as any).userId;

    if (!type || !scheduledAt || !duration || !trainerId || !fee) {
      res.status(400).json({ success: false, message: "Missing fields" });
      return;
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${type} Session with Trainer`,
            },
            unit_amount: Math.round(fee * 100), // in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontend_url}/session-success?success=true&type=${type}&scheduledAt=${scheduledAt}&duration=${duration}&trainerId=${trainerId}&fee=${fee}`,
      cancel_url: `${frontend_url}/session-success?success=false`,
    });

    res.json({ success: true, sessionurl: stripeSession.url });
  } catch (err) {
    console.error("Stripe error", err);
    res.status(500).json({ success: false, message: "Stripe session error" });
  }
};
export const updateSessionStatus = async (req: Request, res: Response): Promise<void> => {
  const sessionId = req.params.id;
  const userId = (req as any).userId as string;

  const parsed = updateSessionStatusValidator.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid status values",
      errors: parsed.error.flatten(),
    });
    return;
  }

  const { status, paymentStatus } = parsed.data;

  try {
    // Fetch the session
    const session = await sessionModel.findById(sessionId);
    if (!session) {
        res.status(404).json({ message: "Session not found" });
        return;
    }

    // Check if user is either the client or the trainer
    if (
      session.clientId.toString() !== userId &&
      session.trainerId.toString() !== userId
    ) {
      res.status(403).json({ message: "Unauthorized to update session" });
      return;
    }

    // Update session
    await sessionModel.updateOne(
      { _id: sessionId },
      { status, paymentStatus }
    );

    res.status(200).json({ message: "Session status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Something went wrong",
    });
  }
};
