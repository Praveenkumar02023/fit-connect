import { Request, Response } from 'express';
import {z} from 'zod'
import { Trainer } from '../models/trainer.model';
import { subscriptionModel } from '../models/subscription.model';

const subscriptionValdidator = z.object({
    trainerId : z.string(),
    paymentId : z.string(),
});

export const createSubscription = async(req : Request , res : Response) : Promise<any> =>{

    const parsed = subscriptionValdidator.safeParse(req.body);

    if(!parsed.success){

        return res.status(400).json({message : "Invalid trainer"});

    }

    const trainerId = parsed.data.trainerId;
    const paymentId = parsed.data.paymentId;
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
            paymentId,
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
        
        const Allsubscription = await subscriptionModel.find({userId : userId});

        res.status(200).json({message : "subscription fetched",Allsubscription});

    } catch (error) {
        console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
    }

}