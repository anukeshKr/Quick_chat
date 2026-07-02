import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { connectDb } from './lib/db.js';
import userRouter from './routes/userRoute.js';
import messageRouter from './routes/messageRoute.js';
import { Server } from "socket.io"


// Create express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// initialize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" }
})

// store online User
export const usersocketMap = {} // {userId:socketId}

// socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user connected", userId);

    if (userId) usersocketMap[userId] = socket.id;

    // Emit online user to all connected clients
    io.emit("getOnlineUsers", Object.keys(usersocketMap));

    // disconnect event
    socket.on("disconnect", () => {
        console.log("user disconnected");
        delete usersocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(usersocketMap))
    })
})

// Connect Db
await connectDb();

// Routes
app.use('/api/status', (req, res) => { res.send("server is live") })
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

const port = process.env.PORT || 5000;

server.listen(port, () => console.log("Server is running on port:" + port))
