import express from "express"
import { authUser } from "../middleware/auth.js";
import { getMessages, getUserForSibebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";


const messageRouter = express.Router();

messageRouter.get("/users", authUser, getUserForSibebar);
messageRouter.get("/:id", authUser, getMessages);
messageRouter.put("/mark/:id", authUser, markMessageAsSeen);
messageRouter.post("/send/:id", authUser, sendMessage);


export default messageRouter;