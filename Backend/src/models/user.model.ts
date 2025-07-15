import mongoose, { model , Document} from "mongoose";

interface UserTypes extends Document{
    name : string,
    email : string,
    password : string,
    gender : string,
    avatar : string
}

const userSchema = new mongoose.Schema<UserTypes>({

    name :{
        type : String,
        required : true,
    },
    email : {
        type: String,
        unique: true,
        required : true, 
    },
    password : {
        type: String,
        required : true
    },
    gender : {
        type : String,
    },
    avatar : {
        type : String
    }

},{timestamps : true}
);

export const userModel =  model<UserTypes>("User",userSchema);