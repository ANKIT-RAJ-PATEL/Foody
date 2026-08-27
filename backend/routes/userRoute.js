import express from "express";
import { getCurrentUser, updateUserLocation } from "../controllers/userController.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

userRouter.get("/currentuser",isAuth,getCurrentUser);
userRouter.post("/updatelocation",isAuth,updateUserLocation);


export default userRouter;

