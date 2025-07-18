import { Request, Response } from 'express';
import {z} from 'zod';
import { paymentModel } from '../models/payment.model';

const makePaymentValidator = z.object({

  amount: z.number().positive({ message: "Amount must be a positive number" }),
  
  purpose: z.enum(["Session", "Event", "Subscription"], {
    required_error: "Payment purpose is required",
  }),

  referenceId: z.string(), // sessionId, eventId, or subscriptionId

  method: z.string().min(1, { message: "Payment method is required" }), // e.g., "UPI", "card"

  transactionId: z.string().min(5, { message: "Transaction ID is required" }),

});


export const makePayment = async(req : Request , res : Response) : Promise<any> => {

    const parsed = makePaymentValidator.safeParse(req.body);


    if(!parsed.success){

        return res.status(400).json({messsage : "Error while making paymemt"});

    }
    const userId = (req as any).userId as string;

    const { amount , purpose , referenceId ,method , transactionId} = parsed.data;

    try {
    
        const newPayment = await paymentModel.create({
            amount,
            purpose,
            referenceId : referenceId,
            userId : userId,
            transactionId : transactionId,
            method,
            status : "success"
        });

        res.status(200).json({message : "payment successfull",newPayment});

    } catch (error) {
         console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
    }

}

export const userPayments = async(req : Request , res : Response) => {

    const userId = (req as any).userId as string;

    try {
        
        const allPayments = await paymentModel.find({userId : userId});

        res.status(200).json({message : "fetched all payments!" , allPayments});

    } catch (error) {
        
         console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });

    }

}

export const userPaymentById = async(req : Request , res : Response) => {

    const paymentId = req.params.id;

    try {
        
        const Payment = await paymentModel.findOne({_id : paymentId});

        res.status(200).json({message : "fetched all payments!" , Payment});

    } catch (error) {
        
         console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });

    }

}
export const getPaymentsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const payments = await paymentModel.find({ userId : userId });

    res.status(200).json({
      message: "Fetched payments by userId successfully",
      payments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error",
    });
  }
};
