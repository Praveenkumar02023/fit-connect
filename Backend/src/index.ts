import { log } from "console";
import express from "express";
import dotenv from "dotenv"
import { connectToDB } from "./utils/db";
import { userRouter } from "./routes/user.routes";
import { trainerRouter } from "./routes/trainer.routes";
import { sessionRouter } from "./routes/session.routes";
import { eventRouter } from "./routes/event.routes";
import { paymentRouter } from "./routes/payment.routes";
import { subscriptionRouter } from "./routes/subscription.routes";
import cors from "cors";


dotenv.config()

const app = express();
const PORT  = process.env.PORT;

app.use(express.json());
app.use(cors());


//routes
app.use('/api/v1/user',userRouter);
app.use('/api/v1/trainer',trainerRouter);
app.use('/api/v1/session',sessionRouter);
app.use('/api/v1/event',eventRouter);
app.use('/api/v1/payment',paymentRouter);
app.use('/api/v1/subscription',subscriptionRouter);

app.listen(PORT,()=>{
    log("server is running on ", PORT);
    connectToDB();
})