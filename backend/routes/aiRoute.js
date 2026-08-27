import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { chatWithAI } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/chat", isAuth, chatWithAI);

export default aiRouter;
