import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { connectDb } from './lib/db.js';


const app = express();

const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Connect Db
await connectDb();


// Routes
app.use('/api/status', (req, res) => {
    res.send("server is live")
})

const port = process.env.PORT || 5000;

server.listen(port, () => console.log("Server is running on port:" + port))
