import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js"

const isRender = process.env.FRONTEND_URL?.includes("onrender");

{/*signup*/ }
export const signUp = async (req, res) => {
    try {
        const { fullname, email, password, mobile, role } = req.body;
        let user = await User.findOne({ email })

        if (!fullname) {
            return res.status(400).json({ message: "Full Name is required" });
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        if (!mobile) {
            return res.status(400).json({ message: "Mobile Number is required" });
        }
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        if (mobile.length < 10) {
            return res.status(400).json({ message: "Mobile number must be at least 10 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            mobile,
            role,
        })

        const token = await genToken(user._id);
        res.cookie("token", token, {
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            domain: isRender ? ".onrender.com" : undefined,
        })

        console.log("signup successfull");
        return res.status(201).json(user)

    } catch (error) {
        console.log("signin error:", error);
        res.status(500).json({ message: "Error in signup" });
    }
}

{/*signin*/ }
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password" });
        }


        const token = await genToken(user._id);
        res.cookie("token", token, {
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            domain: isRender ? ".onrender.com" : undefined,
        })

        return res.status(200).json(user)

    } catch (error) {
        console.log("signin error:", error);
        res.status(500).json({ message: "Error in signin" });
    }
}

{/*logout*/ }
export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            secure: true,
            sameSite: "none",
            domain: isRender ? ".onrender.com" : undefined,
        })
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error in logout" });
    }
}


export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;
        await user.save();
        await sendOtpMail(user.email, otp);

        console.log("OTP sent to email");
        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.log("send otp error:", error);
        return res.status(500).json({ message: "Error in sending otp" });
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email })
        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            console.log('Invalid OTP');
            return res.status(400).json({ message: "Invalid OTP" });
        }
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();
        console.log("OTP verified");
        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.log("verify otp error:", error);
        return res.status(500).json({ message: "Error in verifying otp" });
    }
}


export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "OTP Verification required" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.isOtpVerified = false;
        await user.save();
        console.log("Password reset successful");
        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.log("reset password error:", error);
        return res.status(400).json({ message: "Error in reseting password" });
    }
}


export const googleAuth = async (req, res) => {
    try {
        const { fullname, email, mobile, role } = req.body;
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({
                fullname,
                email,
                mobile,
                role,
            })
        }

        const token = await genToken(user._id);
        res.cookie("token", token, {
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            domain: isRender ? ".onrender.com" : undefined,
        })

        console.log("google auth successfull");
        return res.status(200).json(user)

    } catch (error) {
        console.log("google auth error:", error);
        return res.status(500).json({ message: "Error in Google Signin" });
    }
}