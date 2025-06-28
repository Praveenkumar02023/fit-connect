import mongoose, { Document, model, Schema, Types } from "mongoose";

interface participantTypes extends Document{

    userId : Types.ObjectId,
    eventId : Types.ObjectId,
    registeredAt : Date

}

const particpantSchema = new Schema<participantTypes>({

    userId : {

        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"

    },
    eventId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "Event"
    },
    registeredAt : {
        type : Date,
        default : Date.now,
    }

},{timestamps : true});

export const participantModel = model("Participant",particpantSchema);