import { log } from "console";
import express from "express";
import dotenv from "dotenv"
import { connectToDB } from "./utils/db";
import { userRouter } from "./routes/user.routes";
import { trainerRouter } from "./routes/trainer.routes";
import { sessionRouter } from "./routes/session.routes";


dotenv.config()

const app = express();
const PORT  = process.env.PORT;

//routes
app.use('api/v1/user',userRouter);
app.use('/api/v1/trainer',trainerRouter);
app.use('/api/v1/session',sessionRouter);

app.listen(PORT,()=>{
    log("server is running on ", PORT);
    connectToDB();
})