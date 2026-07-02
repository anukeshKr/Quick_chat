import  jwt  from "jsonwebtoken";
import User from "../modals/user.js";

export const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers['token'];

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Split the header by the space
        const parts = authHeader.split(" ");

        const token = parts[0].toLowerCase() === 'bearer' ? parts[1] : parts[0];

        if (!token) {
            return res.json({ success: false, message: "Token format is invalid" });
        }

        const decoded = jwt.verify(token, process.env.SECRET);

        const user = await User.findById({ _id: decoded.userId }).select("-password")

        if (!user) {
            return res.json({ success: false, message: "user not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


