import { Request, Response } from "express";
import {z} from 'zod';
import { eventModel } from "../models/event.model";


const createEventValidator = z.object({

    title : z.string(),
    description : z.string().optional(),
    type : z.string().optional(),
    location : z.string(),
    prizePool : z.number().optional(),
    registerationFee : z.number().optional(),
    
    date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }).transform(val => new Date(val))
    
})

export const createEvent = async(req : Request , res : Response) : Promise<any> => {

    const organizerId = (req as any).userId as string;

    const parsed = createEventValidator.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.flatten()
    });
  }

  const { title, description, type, location, prizePool, registerationFee, date } = parsed.data;

  try {
    const event = await eventModel.create({
      title,
      description,
      type,
      location,
      prizePool,
      registerationFee,
      date,
      organizerId,
      status : "upcoming"
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });
  }

}

export const getAllEvents = async(req : Request ,res : Response) : Promise<any> => {

    try {
        
        const allEvents = await eventModel.find({});

        if(!allEvents){
            return res.status(400).json({message : "Events not found"});
        }

        return res.status(200).json({message : "events fetched",allEvents});

    } catch (error) {

        console.error(error);
    res.status(500).json({
      message: (error as Error).message || "Internal Server Error"
    });

    }

}

export const getEventById = async(req : Request , res : Response) => {

    const eventId = req.params.id;

    try {
        
        const event = await eventModel.findOne({_id : eventId});


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
  prizePool: z.number().optional(),
  registerationFee: z.number().optional(),
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

  try {

    const deletedEvent = await eventModel.deleteOne({_id : parsed.data.eventId});

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