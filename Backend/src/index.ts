import { log } from "console";
import express from "express";
import dotenv from "dotenv"
import { connectToDB } from "./utils/db";

dotenv.config()

const app = express();
const PORT  = process.env.PORT;

app.listen(PORT,()=>{
    log("server is running on ", PORT);
    connectToDB();
})