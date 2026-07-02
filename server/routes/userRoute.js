import express from "express";
import { checkAuth, login, Signup, updateProfile } from "../controllers/userController.js";
import { authUser } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/signup',Signup);
userRouter.post('/login',login);
userRouter.put('/updateProfile',authUser,updateProfile);
userRouter.get('/check',authUser,checkAuth);


export default userRouter;