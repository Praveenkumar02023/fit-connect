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
import { createServer } from "http";

import cors from "cors"
import { Server } from "socket.io";
import { messageRouter } from "./routes/message.routes";
import { messageModel } from "./models/chat.model";
import { startKeepAlive } from "./utils/keepAlive";


dotenv.config()

const app = express();
const PORT  = process.env.PORT;
const httpServer = createServer(app);

app.use(express.json());
app.use(cors());


//routes
app.use('/api/v1/user',userRouter);
app.use('/api/v1/trainer',trainerRouter);
app.use('/api/v1/session',sessionRouter);
app.use('/api/v1/event',eventRouter);
app.use('/api/v1/payment',paymentRouter);
app.use('/api/v1/subscription',subscriptionRouter);
app.use('/api/v1/message',messageRouter)

const io = new Server(httpServer,{
    
    cors: {
        origin: "*", 
         methods: ["GET", "POST"],
    }
})

const userSocketMap : Record<string,string> = {};

io.on("connection",(socket)=>{

    const userId = socket.handshake.query.userId as string;
    const socketId = socket.id;

    if(userId){

        userSocketMap[userId] = socketId;

    }else return;


    console.log("user connected");

    socket.on("private-message",async({to , message}) => {

        const receiverSocketId = userSocketMap[to];

        
        await messageModel.create({
            senderId : userId,
            receiverId : to,
            message,
        });
        
        if(!receiverSocketId) return;
        io.to(receiverSocketId).emit("receive-message",{from : userId,message});

    })

    socket.on("disconnect",()=>{
        console.log("user disconnected");
    })
})

// Health check route
app.get('/api/v1/health', (req, res) => {
    console.log("health check");
    res.status(200).send('OK');
});

startKeepAlive();

httpServer.listen(PORT,()=>{
    log("server is running on ", PORT);
    connectToDB();
})