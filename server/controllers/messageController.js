import cloudinary from "../lib/cloudinary.js";
import Message from "../modals/Message.js";
import User from "../modals/user.js";
import { io, usersocketMap } from "../server.js"


// Get all users except logged in users


export const getUserForSibebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        // Count number of messages not seen
        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })

        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages })
    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error.message);
    }
}

// Get all the messages for selected Users

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ]
        });

        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });

        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
        console.log(error.message);
    }
}

// api to mark message as seen using MessageId

export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;

        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ sucess: true, })
    } catch (error) {
        res.json({ success: false, message: error.message });
        console.log(error.message);
    }
}

// Send Message to selected User

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            const uploadResponse = cloudinary.uploader.upload(image);
            imageUrl = (await uploadResponse).secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        // emit the new message to the receiver sockert 
        const reciverSocketId = usersocketMap[receiverId];

        if (reciverSocketId) {
            io.to(reciverSocketId).emit("newMessage", newMessage);
        }

        res.json({ success: true, newMessage })
    } catch (error) {
        res.json({ success: false, message: error.message });
        console.log(error.message);
    }
}
