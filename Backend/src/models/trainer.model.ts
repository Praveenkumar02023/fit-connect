import mongoose ,{Schema , Document , model , Types}from "mongoose";
import { userModel } from "./user.model";


interface TrainerTypes extends Document{
    firstName : string,
    lastName : string,
    email : string,
    password : string,
    speciality? : string[], 
    experience? : string,
    pricing_perSession : number,
    pricing_perMonth : number,
    rating? : number,
    avatar : string
    about? : string
    Achievements : string
}

const trainerSchema = new Schema<TrainerTypes>({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    speciality : {
        type : [String],
    },
    experience : {
        type : String,
    },
    pricing_perSession : {
        type : Number,
        required : true,
    },
    pricing_perMonth : {
        type:Number,
        required : true,
    },
    rating : {
        type : Number,
    },
    avatar : {
        type : String
    },
    about : {
        type : String
    },
    Achievements : {
        type : String
    }

},{timestamps : true});


export const Trainer = model("Trainer",trainerSchema);