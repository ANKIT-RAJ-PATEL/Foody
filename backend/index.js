import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';
import cors from 'cors';
import shopRouter from './routes/shopRoute.js';
import itemRouter from './routes/itemRoute.js';
import orderRouter from './routes/orderRoute.js';
import aiRouter from './routes/aiRoute.js';
const port = process.env.PORT || 4000;
import http from "http";
import { Server } from 'socket.io';
import { socketHandler } from './socket.js';
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || "http://localhost:5173"
        ],
        credentials: true,
        methods: ['GET', 'POST']
    }
})

app.set("io", io);


app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);
app.use("/api/ai", aiRouter);


socketHandler(io)

server.listen(port, async () => {
    await connectDb();
    console.log(`Server is running on port http://localhost:${port}`);
})