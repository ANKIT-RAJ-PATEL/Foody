import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { addItem, deleteItem, editItem, getItemByCity, getItemById, getItemsByShop, rating, searchItems } from "../controllers/itemController.js";
import { upload } from "../middlewares/multer.js";


const itemRouter = express.Router();

itemRouter.post("/additem",isAuth,upload.single("image"),addItem);
itemRouter.post("/edititem/:itemId",isAuth,upload.single("image"),editItem);
itemRouter.get("/getbyid/:itemId",isAuth,getItemById);
itemRouter.get("/deleteitem/:itemId",isAuth,deleteItem);
itemRouter.get("/getbycity/:city",isAuth,getItemByCity);
itemRouter.get("/getbyshop/:shopId",isAuth,getItemsByShop);
itemRouter.get("/searchitem",isAuth,searchItems);
itemRouter.post("/rating",isAuth,rating);


export default itemRouter;

