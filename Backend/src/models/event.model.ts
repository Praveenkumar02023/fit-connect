import mongoose, { Document, Schema, Types ,model } from "mongoose";

interface EventTypes extends Document{

    organizerId : Types.ObjectId,
    title : string,
    description? : string,
    type? : string,
    location : string,
    prizePool? : number,
    status : string,
    registrationFee? : number,
    date : Date,
    avatar : string
}

const eventSchema = new Schema<EventTypes>({

    organizerId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },

    title : {type : String , required : true},
    description : {type : String },
    type : {type : String },
    location : {type : String , required : true},
    prizePool : {type : Number },
    status : {type : String , required : true},
    registrationFee : {type : Number },
    date : {type : Date , required : true},
    avatar : {type : String,required : true}

},{timestamps : true});

export const eventModel = model("Event",eventSchema);