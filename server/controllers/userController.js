import bcrypt from "bcryptjs"
import User from "../modals/user.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


//  Singup new user


export const Signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" })
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.json({ success: false, message: "Account already exits!" });
        }

        const salt = await bcrypt.genSalt(10);

        const hashsedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashsedPassword,
            bio
        })

        const token = generateToken(newUser._id);

        res.json({ success: true, userData: newUser, token: token, message: "Accoount created successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error.message);
    }
}


// Login for user

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.json({ success: false, message: "user doesnot exits" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            res.json({ success: false, message: "Password doesnot match" })
        }

        const token = generateToken(user._id);
        res.json({ success: true, userData: user, token: token, message: "Login success" })
    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error.message);
    }
}

//Controller to check if the user is authorized

export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
}

// Controller to update user profile details

export const updateProfile = async (req, res) => {
    try {
        const { fullName, profilePic, bio } = req.body;

        const userId = req.user._id;

        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { returnDocument: 'after' });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName, profilePic: upload.secure_url }, { returnDocument: 'after' })
        }

        res.json({ success: true, user: updatedUser })
    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error.message);
    }
}