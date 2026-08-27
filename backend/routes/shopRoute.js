import express from "express";
import { createAndEditShop, getMyshop, getShopByCity } from "../controllers/shopController.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";


const shopRouter = express.Router();

shopRouter.post("/createeditshop",isAuth,upload.single("image"),createAndEditShop);
shopRouter.get("/getmyshop",isAuth,getMyshop);
shopRouter.get("/getbycity/:city",isAuth,getShopByCity);


export default shopRouter;

