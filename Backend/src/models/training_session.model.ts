import mongoose, { Document, model, Schema, Types } from "mongoose";

interface sessionTypes extends Document{

    type : string,
    scheduledAt : Date,
    duration? : number,
    status? : string,
    trainerId : Types.ObjectId,
    ClientId : Types.ObjectId

}

const sessionSchema = new Schema<sessionTypes>({

    type : {required : true, type : String},
    scheduledAt : {type : Date , required : true},
    duration : {type : Number},
    status : {type : String},
    trainerId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "Trainer"
    },
    ClientId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"
    }

},{timestamps : true});

export const sessionModel = model("Session",sessionSchema);