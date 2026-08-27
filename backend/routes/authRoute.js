import express from "express";
import { googleAuth, logOut, resetPassword, sendOtp, signIn, signUp, verifyOtp } from "../controllers/authcontroller.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.get("/logout", logOut)
authRouter.post("/sendotp", sendOtp)
authRouter.post("/verifyotp",verifyOtp )
authRouter.post("/resetpassword", resetPassword)
authRouter.post("/googleauth", googleAuth)

export default authRouter;

