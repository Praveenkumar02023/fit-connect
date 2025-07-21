import { Request, Response } from 'express';
import {z} from 'zod'
import { Trainer } from '../models/trainer.model';
import { subscriptionModel } from '../models/subscription.model';
import Stripe from 'stripe';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set.");
}
const stripe = new Stripe(stripeSecretKey);
const frontend_url = process.env.FRONTEND_URL;


const subscriptionValdidator = z.object({
    trainerId : z.string(),
});


export const createSubscription = async(req : Request , res : Response) : Promise<any> =>{
   

    const parsed = subscriptionValdidator.safeParse(req.body);
    console.log(parsed.data);

    if(!parsed.success){

        return res.status(400).json({message : "Invalid trainer"});

    }

    const trainerId = parsed.data.trainerId;
    const userId = (req as any).userId as string;
    try {
        
        const trainer = await Trainer.findOne({_id : trainerId});
        
        if(!trainer){

            return res.status(400).json({message : "Trainer not found"});

        }

        const amount = trainer.pricing_perMonth;
        const startDate = new Date(); 
        const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days

        const newSubscription = await subscriptionModel.create({

            trainerId : trainerId,
            userId,
            amount,
            paymentId : userId ,
            startDate,
            endDate,
            isActive : true
        });

        res.status(200).json({message : "subscribed!",newSubscription});

    } catch (error) {
        console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
    }
}

const cancelSubscriptionValidator = z.object({

    subscriptionId : z.string()

});

export const cancelSubscription = async(req : Request , res : Response) : Promise<any> =>
{

    const userId = (req as any).userId as string;

    const parsed = cancelSubscriptionValidator.safeParse(req.body);

    if(!parsed.success){

        return res.status(400).json({message : "invalid subscription Id"});

    }


    const subscriptionId = parsed.data.subscriptionId;

    try {
        
        const subscription = await subscriptionModel.findOne({_id : subscriptionId, userId : userId});

        if(!subscription){

            return res.status(400).json({message : "subscription not found"});

        }

        subscription.isActive = false;
        await subscription.save();

        res.status(200).json({message : "subscription Cancelled!",subscription});
        
    } catch (error) {
        console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
    }

}

export const viewSubscription = async(req : Request , res : Response) : Promise<any> => {

    const subscriptionId = req.params.id;

    const userId = (req as any).userId as string;

    try {
        
        const subscription = await subscriptionModel.findOne({_id : subscriptionId , userId : userId});

        res.status(200).json({message : "subscription fetched",subscription});

    } catch (error) {
        console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
    }

}

export const getAllSubscription = async(req : Request , res : Response) : Promise<any> => {
    const userId = (req as any).userId as string;

    try {
        
        const Allsubscription = await subscriptionModel.find({
         $or: [
        { userId },
        { trainerId : userId },
      ],
        });

        res.status(200).json({message : "subscription fetched",Allsubscription});

    } catch (error) {
        console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
    }

}
export const createStripeSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { trainerId } = req.body;

    if (!trainerId) {
      res.status(400).json({ success: false, message: "Trainer ID is required" });
      return;
    }

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      res.status(404).json({ success: false, message: "Trainer not found" });
      return;
    }

    const amount = trainer.pricing_perMonth;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `1-Month Subscription with ${trainer.firstName}`,
              description: `Specialty: ${trainer.speciality}`,
            },
            unit_amount: amount * 100, // Convert to paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontend_url}/subscription-success?success=true&trainerId=${trainerId}&userId=${userId}&purpose=subscription&amount=${amount}`,

      cancel_url: `${frontend_url}/subscription-success?success=false`
    });

    res.status(200).json({ success: true, sessionurl: session.url });
  } catch (err) {
    console.error("Stripe error", err);
    res.status(500).json({ success: false, message: "Stripe session error" });
  }
};
export const getTrainerSubscription = async(req : Request , res : Response) : Promise<any> => {
    const userId = (req as any).userId as string;

    try {
        
        const Allsubscription = await subscriptionModel.find({trainerId : userId});

        res.status(200).json({message : "subscription fetched",Allsubscription});

    } catch (error) {
        console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
    }

}

export const getTrainers = async (req : Request, res : Response) => {



  try {
    const subscriptions = await subscriptionModel
      .find({ userId: (req as any).userId as string, isActive: true })
      .populate("trainerId");

    const trainers = subscriptions.map((sub) => sub.trainerId);

    res.status(200).json({ trainers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subscribed trainers" });
  }
}