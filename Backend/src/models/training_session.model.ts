import mongoose, { Document, model, Schema, Types } from "mongoose";
import { number, string } from "zod";

interface sessionTypes extends Document{

    type : string,
    scheduledAt : Date,
    duration? : number,
    status? : string,
    trainerId : Types.ObjectId,
    clientId : Types.ObjectId,
    paymentId? : Types.ObjectId,
    paymentStatus : string,
    fee : number,
    meetingLink : string
}

const sessionSchema = new Schema<sessionTypes>({

    type : {required : true, type : String },
    scheduledAt : {type : Date , required : true},
    duration : {type : Number},
    status : {type : String , enum : ['pending','confirmed','cancelled' , 'completed']},
    trainerId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "Trainer"
    },
    clientId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    paymentId : {
        type : Schema.Types.ObjectId,
        ref : "Payment"
    },
    paymentStatus : {
        type : String,
        enum : ['pending','success'],
        required : true,
    },
    fee : {
        type : Number,
        required : true,  
    },
    meetingLink: {
        type: String,
       required: false,
    }

},{timestamps : true});

export const sessionModel = model("Session",sessionSchema);