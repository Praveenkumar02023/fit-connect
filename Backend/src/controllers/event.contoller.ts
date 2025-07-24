import { Request, Response } from "express";
import {z} from 'zod';
import { eventModel } from "../models/event.model";
import { participantModel } from "../models/event_participant.model";
import Stripe from 'stripe';
import { userModel } from "../models/user.model";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set.");
}
const stripe = new Stripe(stripeSecretKey);
const frontend_url = process.env.FRONTEND_URL;


const createEventValidator = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.string().optional(),
  location: z.string(),

  prizePool: z
    .preprocess((val) => (val !== "" ? Number(val) : undefined), z.number().optional()),

  registrationFee: z
    .preprocess((val) => (val !== "" ? Number(val) : undefined), z.number().optional()),

 date: z.preprocess((val) => {
  if (typeof val === "string" || val instanceof String) {
    const d = new Date(val as string);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return val;
}, z.date({
  required_error: "Date is required",
  invalid_type_error: "Invalid date",
})),

});



export const createEvent = async (req: Request, res: Response): Promise<any> => {
  // console.log("in the controller");
  
  const organizerId = (req as any).userId as string;

//   console.log("📥 req.body:", req.body);
// console.log("📅 req.body.date:", req.body.date);


  const parsed = createEventValidator.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.flatten(),
    });
  }

  const { title, description, type, location, prizePool, registrationFee, date } = parsed.data;

  

  try {
    if (!req.file?.path) {
      return res.status(404).json({ message: "Image file missing" });
    }

    // console.log("in try catch");
    const avatar = req.file.path;

    const event = await eventModel.create({
      title,
      description,
      type,
      location,
      prizePool,
      registrationFee,
      date,
      organizerId,
      status: "upcoming",
      avatar,
    });

    if (!event) {
      return res.status(401).json({ message: "Error creating event!" });
    }

    

    // console.log("Event created:", event);

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error",
    });
  }
};


export const getAllEvents = async(req : Request ,res : Response) : Promise<any> => {

    try {
        
        const allEvents = await eventModel.find({});

        if(!allEvents){
            return res.status(400).json({message : "Events not found"});
        }

        return res.status(200).json({message : "events fetched",allEvents});

    } catch (error) {

      console.error(error);
      res.status(501).json({
      message: (error as Error).message || "Internal Server Error"
    });

    }

}

export const getEventById = async(req : Request , res : Response) : Promise<any> => {

    const eventId = req.params.id;

    try {
        
        const event = await eventModel.findOne({_id : eventId});

        if(!event){
          return res.status(400).json({message : "event not found"})
        }

        res.status(200).json({message : "event fetched",event});

    } catch (error) {
        
        console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });

    }

}

const updateEventValidator = z.object({
title: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  location: z.string().optional(),
 prizePool: z.preprocess((val) => Number(val), z.number()).optional(),
registrationFee: z.preprocess((val) => Number(val), z.number()).optional(),

  date: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date format"
    })
    .transform(val => new Date(val))
    .optional(),
    eventId : z.string()
})

export const updateEvent = async(req : Request , res : Response) : Promise<any> => {

    const parsed = updateEventValidator.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid update data"
    });
  }

  const eventId = parsed.data.eventId;

  try {

    if (req.file?.path) {
    (parsed.data as any).avatar = req.file.path;
    }

    const updatedEvent = await eventModel.findByIdAndUpdate(
      eventId,
      parsed.data,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
  }

}

const deleteEventValidator = z.object({

    eventId : z.string()

})

export const deleteEvent = async(req : Request , res : Response) : Promise<any> => {

    const parsed = deleteEventValidator.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid update data"
    });
  }

  const userId = (req as any).userId as string;

  try {

    const deletedEvent = await eventModel.deleteOne({_id : parsed.data.eventId , organizerId : userId});

    if(!deletedEvent){
        return res.status(400).json({message : "event not found"});
    }

    res.status(200).json({message : "event deleted",deletedEvent});

  } catch (error) {
     console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
  }
}

const registerEventValidator = z.object({

    eventId : z.string()

});

export const registerEvent = async(req : Request , res : Response) : Promise<any> => {

  const parsed = registerEventValidator.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid update data"
    });
  }

  const eventId = parsed.data.eventId;
  const userId = (req as any).userId as string;

  try {

    const event = await eventModel.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existing = await participantModel.findOne({ eventId, userId });
    if (existing) return res.status(400).json({ message: "Already registered" });

    const participant = await participantModel.create({
      eventId,
      userId,
      registeredAt: new Date(),
    });

    res.status(201).json({ message: "Registered successfully", participant });


  } catch (error) {
     console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
  }

}


const deleteRegistrationValidator = z.object({

    eventId : z.string()

});

export const deleteRegistration = async(req : Request , res : Response) : Promise<any> => {

  const parsed = deleteRegistrationValidator.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid update data"
    });
  }

  const eventId = parsed.data.eventId;
  const userId = (req as any).userId as string;

  try {

    const event = await eventModel.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const participant = await participantModel.deleteOne({userId , eventId});

    res.status(201).json({ message: "cancelled successfully", participant });


  } catch (error) {
     console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
  }

}

const getAllParticipantValidator = z.object({

    eventId : z.string()

});

export const getAllParticipants = async(req : Request , res : Response) : Promise<any> => {

  const parsed = getAllParticipantValidator.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid update data"
    });
  }

  const eventId = parsed.data.eventId;  

  try {
    
    const allParticipants = await participantModel.find({eventId : eventId});

    res.status(200).json({message : "all participants fetched" , allParticipants});

  } catch (error) {
      console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
  }

}
export const getUserRegisteredEvents = async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).userId as string;
  try{
    const participations = await participantModel.find({userId});
     if (!participations.length) {
      return res.status(200).json({ message: "No registered events found", events: [] });
    }
    const eventIds = participations.map(p=>p.eventId);
    const events = await eventModel.find({ _id: { $in: eventIds } });
    res.status(200).json({ message: "Registered events fetched", events });

  }catch(error){
    console.log(error);
     res.status(500).json({
      message: (error as Error).message || "Internal server error"
    });
  }
}
export const createStripeSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { eventId } = req.body;
    if (!eventId) {
          res.status(400).json({ success: false, message: "Event ID is required" });
          return;
        }

        const event = await eventModel.findById(eventId);
        if (!event) {
          res.status(404).json({ success: false, message: "Event not found" });
          return;
        }
        const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Registration for ${event.title}`,
              description: `Type: ${event.type}`,
            },
            unit_amount: ((event.registrationFee ?? 0) * 100), // Convert to paise, default to 0 if undefined
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontend_url}/event-success?success=true&eventId=${eventId}&userId=${userId}&purpose=event&amount=${(event.registrationFee ?? 0)}`,

      cancel_url: `${frontend_url}/event-success?success=false`
    });

    res.status(200).json({ success: true, sessionurl: session.url });
  } catch (err) {
    console.error("Stripe error", err);
    res.status(500).json({ success: false, message: "Stripe session error" });
  }
};
export const checkEventRegistration = async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).userId;
  const { eventId } = req.body;

  if (!eventId) return res.status(400).json({ message: "Event ID required" });

  try {
    const existing = await participantModel.findOne({ userId, eventId });
    res.status(200).json({ registered: !!existing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getTrainerEvents = async (req: Request, res: Response) => {
  const trainerId = (req as any).userId; 

  try {
    const events = await eventModel.find({ organizerId: trainerId });

    res.status(200).json({
      message: "Trainer events fetched successfully",
      events,
    });
  } catch (error) {
    console.error("Error fetching trainer events:", error);
    res.status(500).json({
      message: "Failed to fetch trainer events",
      error: (error as Error).message,
    });
  }
};

export const getEventParticipants = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  try {
    const registrations = await participantModel.find({ eventId });

    const participants = await Promise.all(
      registrations.map(async (registration) => {
        const user = await userModel.findById(registration.userId).select("name email");

        return {
          name: user?.name || "Unknown",
          email: user?.email || "Unknown",
          userId: registration.userId
        };
      })
    );

    res.status(200).json({
      message: "Participants fetched successfully",
      participants,
    });

  } catch (error) {
    console.error("Error fetching event participants:", error);
    res.status(500).json({
      message: "Failed to fetch participants",
      error: (error as Error).message,
    });
  }
};


