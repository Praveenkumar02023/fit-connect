import mongoose, { Document , model, Mongoose, Schema, Types } from "mongoose";

interface subscriptionTypes extends Document{

    trainerId : Types.ObjectId,
    userId : Types.ObjectId,
    amount : number,
    paymentId : string,
    startDate : Date,
    endDate : Date,
    isActive : boolean
}

const subscriptionSchema = new Schema<subscriptionTypes>({

    trainerId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "Trainer"
    },
    userId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    amount : {required : true , type : Number},
    paymentId : {required : true , type : String},
    startDate : {required : true , type : Date},
    endDate : {required : true , type : Date},
    isActive : {required : true , type : Boolean},

},{timestamps : true});

export const subscriptionModel = model("Subscription",subscriptionSchema);