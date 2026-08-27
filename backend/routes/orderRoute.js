import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { acceptOrder, getCurrentOrder, getDeliveryBoyAssignment, getMyOrders, getOrderById, getTodayDeliveries, placeOrder, sendDeliveryOTP, updateOrderStatus, verifyDeliveryOTP, verifyPayment } from "../controllers/orderConroller.js";

const orderRouter = express.Router();

orderRouter.get("/myorder",isAuth,getMyOrders);
orderRouter.get("/getassignment",isAuth,getDeliveryBoyAssignment);
orderRouter.get("/getcurrentorder",isAuth,getCurrentOrder);
orderRouter.post("/placeorder",isAuth,placeOrder);
orderRouter.post("/senddeliveryotp",isAuth,sendDeliveryOTP);
orderRouter.post("/verifydeliveryotp",isAuth,verifyDeliveryOTP);
orderRouter.get("/acceptorder/:assignmentId",isAuth,acceptOrder);
orderRouter.get("/getorderbyid/:orderId",isAuth,getOrderById);
orderRouter.post("/updatestatus/:orderId/:shopId",isAuth,updateOrderStatus);
orderRouter.post("/verifypayment",isAuth,verifyPayment);
orderRouter.get("/gettodaydelivery",isAuth,getTodayDeliveries);




export default orderRouter;

