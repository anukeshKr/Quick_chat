import jwt from "jsonwebtoken";


// functin for generate token
export const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.SECRET);
    return token;
}