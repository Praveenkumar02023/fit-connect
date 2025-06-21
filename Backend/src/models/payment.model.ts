import mongoose, { Document, model, Schema, Types } from "mongoose";

interface paymentTypes extends Document{

    amount : number,
    purpose : string,
    method : string,
    status : boolean,
    transactionId : string,
    userId : Types.ObjectId

}

const paymentSchema = new Schema<paymentTypes>({

    amount : {type : Number , required : true},
    purpose : {type : String , required : true},
    method : {type : String , required : true},
    status : {type : Boolean , required : true},
    transactionId : {type : String , required : true},
    userId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"
    }

},{timestamps : true});

export const paymentModel = model("Payment",paymentSchema);