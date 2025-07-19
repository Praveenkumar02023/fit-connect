import { model, Schema } from "mongoose"

interface message{
    message : string,
    senderId : string,
    receiverId : string
};

const messageSchema = new Schema<message>({
    message : {type : String,required : true},
    senderId : {type : String},
    receiverId : {type : String}
},{timestamps : true})

export const messageModel = model("Message",messageSchema);