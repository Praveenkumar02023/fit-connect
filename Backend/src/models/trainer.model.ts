import mongoose ,{Schema , Document , model , Types}from "mongoose";
import { userModel } from "./user.model";


interface TrainerTypes extends Document{

    speciality? : string[], 
    experience? : string,
    pricing_perSession : number,
    pricing_perMonth : number,
    rating? : number,
    userId : Types.ObjectId

}

const trainerSchema = new Schema<TrainerTypes>({
    speciality : {
        type : [String],
    },
    experience : {
        type : String,
        required : true,
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
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    }
},{timestamps : true});


export const Trainer = model("Trainer",trainerSchema);