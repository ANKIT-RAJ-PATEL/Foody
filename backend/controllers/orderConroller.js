import Order from "../models/orderModel.js";
import Shop from "../models/shopmodel.js"
import User from "../models/usermodel.js";
import DeliveryAssignment from "../models/deliveryAssignment.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();



let instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const placeOrder = async (req, res) => {
    try {
        const { cartItems, totalAmount, paymentMethod, deliveryAddress } = req.body;
        if (cartItems.length === 0 || !cartItems) {
            return res.status(400).json({ message: "cart is empty" })
        }
        if (!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude) {
            return res.status(400).json({ message: "delivery address is required" })
        }

        const groupItemsByShop = {}
        cartItems.forEach(item => {
            const shopId = item.shop;
            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = []
            }
            groupItemsByShop[shopId].push(item)
        });

        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {
            const shop = await Shop.findById(shopId).populate("owner")
            if (!shop) {
                return res.status(404).json({ message: "shop not found" })
            }
            const items = groupItemsByShop[shopId]
            const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)
            return {
                shop: shop._id,
                owner: shop.owner._id,
                subtotal,
                shopOrderItems: items.map((i) => ({
                    item: i.id,
                    price: i.price,
                    quantity: i.quantity,
                    name: i.name,
                }))
            }
        }));

        if (paymentMethod === "online") {
            const razorOrder = await instance.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: `receipt_order_${Math.random() * 1000}}`,
            })
            const newOrder = await Order.create({
                user: req.userId,
                paymentMethod,
                deliveryAddress,
                totalAmount,
                shopOrders,
                razorpayOrderId: razorOrder.id,
                payment: false,
            })
            return res.status(201).json({
                razorOrder,
                orderId: newOrder._id,

            })
        }

        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders,
        })
        await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")
        await newOrder.populate("shopOrders.shop", "name")
        await newOrder.populate("shopOrders.owner", "name socketId")
        await newOrder.populate("user", "name email mobile")

        const io = req.app.get('io');

        console.log("📦 New order placed:", newOrder._id);
        console.log("🏪 Number of shop orders:", newOrder.shopOrders.length);

        if (io) {
            newOrder.shopOrders.forEach((shopOrder, index) => {
                const owner = shopOrder.owner;
                const ownerSocketId = owner?.socketId;
                
                console.log(`🏪 Shop Order ${index + 1}:`);
                console.log(`   Owner: ${owner?.name} (ID: ${owner?._id})`);
                console.log(`   Socket ID: ${ownerSocketId || 'NOT CONNECTED'}`);
                
                if (ownerSocketId) {
                    const eventData = {
                        _id: newOrder._id,
                        paymentMethod: newOrder.paymentMethod,
                        user: newOrder.user,
                        shopOrders: shopOrder,
                        createdAt: newOrder.createdAt,
                        deliveryAddress: newOrder.deliveryAddress,
                        payment: newOrder.payment,
                    };
                    
                    io.to(ownerSocketId).emit("newOrder", eventData);
                    console.log(`✅ Emitted newOrder event to ${owner.name} (${ownerSocketId})`);
                } else {
                    console.log(`⚠️ Owner ${owner?.name} is not connected (no socketId)`);
                }
            });
        } else {
            console.log("❌ Socket.io instance not available!");
        }

        return res.status(201).json(newOrder)

    } catch (error) {
        return res.status(500).json({
            message: "error in place order",
            error: error?.message || JSON.stringify(error)
        });
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, orderId } = req.body;
        const payment = await instance.payments.fetch(razorpay_payment_id);
        if (!payment || payment.status !== "captured") {
            return res.status(400).json({ message: "payment not captured" });
        }
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "order not found" });
        }
        order.payment = true;
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();

        await order.populate("shopOrders.shopOrderItems.item", "name image price")
        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.owner", "name socketId")
        await order.populate("user", "name email mobile")

        const io = req.app.get('io');

        console.log("💳 Payment verified for order:", order._id);
        console.log("🏪 Number of shop orders:", order.shopOrders.length);

        if (io) {
            order.shopOrders.forEach((shopOrder, index) => {
                const owner = shopOrder.owner;
                const ownerSocketId = owner?.socketId;
                
                console.log(`🏪 Shop Order ${index + 1}:`);
                console.log(`   Owner: ${owner?.name} (ID: ${owner?._id})`);
                console.log(`   Socket ID: ${ownerSocketId || 'NOT CONNECTED'}`);
                
                if (ownerSocketId) {
                    const eventData = {
                        _id: order._id,
                        paymentMethod: order.paymentMethod,
                        user: order.user,
                        shopOrders: shopOrder,
                        createdAt: order.createdAt,
                        deliveryAddress: order.deliveryAddress,
                        payment: order.payment,
                    };
                    
                    io.to(ownerSocketId).emit("newOrder", eventData);
                    console.log(`✅ Emitted newOrder event to ${owner.name} (${ownerSocketId})`);
                } else {
                    console.log(`⚠️ Owner ${owner?.name} is not connected (no socketId)`);
                }
            });
        } else {
            console.log("❌ Socket.io instance not available!");
        }
        return res.status(200).json(order)

    } catch (error) {
        return res.status(500).json({ message: `error in verify payment: ${error}` })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (user.role == "user") {
            const orders = await Order.find({ user: req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.owner", "name email mobile")
                .populate("shopOrders.shopOrderItems.item", "name image price")

            res.status(200).json(orders)
        } else if (user.role == "owner") {
            const orders = await Order.find({ "shopOrders.owner": req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("user")
                .populate("shopOrders.shopOrderItems.item", "name image price")
                .populate("shopOrders.assignedDeliveryBoy", "fullname mobile")


            const filteredOrders = orders.map((order => ({
                _id: order._id,
                paymentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                createdAt: order.createdAt,
                deliveryAddress: order.deliveryAddress,
                paymetn: order.payment,
            })))


            res.status(200).json(filteredOrders)
        }

    } catch (error) {
        return res.status(500).json({ message: `error in get user and owner orders: ${error}` })
    }
}


export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId);

        const shopOrder = order.shopOrders.find(o => o.shop == shopId)
        if (!shopOrder) {
            return res.status(404).json({ message: "shop order not found" })
        }
        shopOrder.status = status


        let deliveryBoyPayload = [];
        if (status == "out of delivery" && !shopOrder.assignment) {
            const { longitude, latitude } = order.deliveryAddress;
            console.log("🔍 Searching for delivery boys near:", { latitude, longitude });
            console.log("📦 Order details:", {
                orderId: order._id,
                shopId: shopOrder.shop,
                shopOrderId: shopOrder._id
            });
            
            // First, let's check all delivery boys in the database
            const allDeliveryBoys = await User.find({ role: "deliveryboy" });
            console.log(`👥 Total delivery boys in database: ${allDeliveryBoys.length}`);
            
            allDeliveryBoys.forEach((boy, index) => {
                console.log(`   ${index + 1}. ${boy.fullname}:`, {
                    hasLocation: !!boy.location?.coordinates,
                    coordinates: boy.location?.coordinates,
                    isOnline: boy.isOnline,
                    hasSocketId: !!boy.socketId,
                    socketId: boy.socketId
                });
            });
            
            const nearByDeliveryBoys = await User.find({
                role: "deliveryboy",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [Number(longitude), Number(latitude)]
                        },
                        $maxDistance: 5000 // 5km
                    }
                }
            });

            console.log(`📍 Found ${nearByDeliveryBoys.length} nearby delivery boys (within 5km)`);
            
            if (nearByDeliveryBoys.length === 0 && allDeliveryBoys.length > 0) {
                console.log("⚠️ No delivery boys found nearby. Checking if location index exists...");
                console.log("💡 TIP: Make sure delivery boys have updated their location via socket");
            }

            const nearByIds = nearByDeliveryBoys.map(b => b._id);
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                status: { $nin: ["brodcasted", "completed"] }
            }).distinct("assignedTo");

            const busyIdSet = new Set(busyIds.map(id => id.toString(id)));

            const availableBoys = nearByDeliveryBoys.filter(b => !busyIdSet.has(String(b._id)))
            const candidates = availableBoys.map(b => b._id)

            console.log(`✅ ${availableBoys.length} available delivery boys (${busyIds.length} busy)`);

            if (candidates.length === 0) {
                await order.save();
                return res.status(400).json({ message: "order status updated but there is no delivery boy available right now" })
            }

            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder._id,
                brodcastedTo: candidates,
                status: "brodcasted",
            })

            await deliveryAssignment.populate("order")
            await deliveryAssignment.populate("shop")

            shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo
            shopOrder.assignment = deliveryAssignment._id;
            deliveryBoyPayload = availableBoys.map(b => ({
                id: b._id,
                fullname: b.fullname,
                longitude: b.location.coordinates?.[0],
                latitude: b.location.coordinates?.[1],
                mobile: b.mobile,

            }))

            const io = req.app.get("io");
            if (io) {
                let sentCount = 0;
                availableBoys.forEach(boy => {
                    const boySocketId = boy.socketId;
                    if (boySocketId) {
                        console.log(`📤 Sending assignment to ${boy.fullname} (${boySocketId})`);
                        io.to(boySocketId).emit('newAssignment', {
                            sentTo: boy._id,
                            assignmentId: deliveryAssignment._id,
                            orderId: deliveryAssignment.order._id,
                            shopName: deliveryAssignment.shop.name,
                            deliveryAddress: deliveryAssignment.order.deliveryAddress,
                            items: deliveryAssignment.order.shopOrders.find(so => so._id.equals(deliveryAssignment.shopOrderId)).shopOrderItems || [],
                            subtotal: deliveryAssignment.order.shopOrders.find(so => so._id.equals(deliveryAssignment.shopOrderId))?.subtotal,
                        })
                        sentCount++;
                    } else {
                        console.log(`⚠️ ${boy.fullname} has no socketId - offline or not connected`);
                    }
                })
                console.log(`✉️ Assignment sent to ${sentCount}/${availableBoys.length} delivery boys`);
            } else {
                console.log("❌ Socket.io instance not available!");
            }

        }

        await order.save();
        const updatedShopOrder = order.shopOrders.find(o => o.shop == shopId)
        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.assignedDeliveryBoy", "fullname email mobile")
        await order.populate("user", "socketId")

        const io = req.app.get('io');
        if (io) {
            const userSocketId = order.user.socketId;
            if (userSocketId) {
                io.to(userSocketId).emit("updateStatus", {
                    orderId: order._id,
                    shopId: updatedShopOrder.shop._id,
                    status: updatedShopOrder.status,
                    userId: order.user._id,
                })
            }
        }

        return res.status(200).json({
            shopOrder: updatedShopOrder,
            assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
            availableBoys: deliveryBoyPayload,
            assignment: updatedShopOrder?.assignment._id,
        })
    } catch (error) {
        return res.status(500).json({ message: `error in update order status: ${error}` })
    }
}

export const getDeliveryBoyAssignment = async (req, res) => {
    try {
        const deliveryBoyId = req.userId;
        console.log(`📋 Fetching assignments for delivery boy: ${deliveryBoyId}`);
        
        const assignments = await DeliveryAssignment.find({
            brodcastedTo: deliveryBoyId,
            status: "brodcasted",
        })
            .populate("order")
            .populate("shop");

        console.log(`📦 Found ${assignments.length} broadcasted assignments`);

        const formated = assignments.map(a => ({
            assignmentId: a._id,
            orderId: a.order._id,
            shopName: a.shop.name,
            deliveryAddress: a.order.deliveryAddress,
            items: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId)).shopOrderItems || [],
            subtotal: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId)).subtotal,
        }));
        
        return res.status(200).json(formated);
    } catch (error) {
        console.log(`❌ Error in getDeliveryBoyAssignment: ${error.message}`);
        return res.status(500).json({ message: `error in get Assignments: ${error}` });
    }
}


export const acceptOrder = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await DeliveryAssignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "assignment not found" })
        }
        if (assignment.status != "brodcasted") {
            return res.status(400).json({ message: "assignment is expired" })
        }

        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: { $nin: ["brodcasted", "completed"] }
        })

        if (alreadyAssigned) {
            return res.status(400).json({ message: "you are already assigned to another order" })
        }

        assignment.assignedTo = req.userId;
        assignment.status = 'assigned';
        assignment.acceptedAt = new Date();
        await assignment.save();

        const order = await Order.findById(assignment.order)
        if (!order) {
            return res.status(404).json({ message: "order not found" })
        }


        const shopOrder = order.shopOrders.find(so => so._id.toString() == assignment.shopOrderId.toString())
        shopOrder.assignedDeliveryBoy = req.userId;
        await order.save();

        return res.status(200).json({ message: "order accepted successfully" })

    } catch (error) {
        return res.status(500).json({ message: `error in accept order: ${error}` })
    }
}

export const getCurrentOrder = async (req, res) => {
    try {
        console.log(`🚚 Fetching current order for delivery boy: ${req.userId}`);
        
        const assignment = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: "assigned"
        })
            .populate("shop", "name")
            .populate("assignedTo", "fullname mobile location email")
            .populate({
                path: "order",
                populate: [{ path: "user", select: "fullname mobile email location", }]
            });

        if (!assignment) {
            console.log(`ℹ️ No current assignment found for delivery boy: ${req.userId}`);
            return res.status(404).json({ message: "assignment not found" });
        }
        if (!assignment.order) {
            console.log(`⚠️ Assignment found but order missing: ${assignment._id}`);
            return res.status(404).json({ message: "order not found" });
        }

        const shopOrder = assignment.order.shopOrders.find(so => String(so._id) == String(assignment.shopOrderId));

        if (!shopOrder) {
            console.log(`⚠️ Shop order not found in order for shopOrderId: ${assignment.shopOrderId}`);
            return res.status(404).json({ message: "shop order not found" });
        }

        let deliveryBoyLocation = { lat: null, lon: null };
        if (assignment.assignedTo.location.coordinates?.length == 2) {
            deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
            deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0];
        }

        let customerLocation = { lat: null, lon: null };
        if (assignment.order.deliveryAddress) {
            customerLocation.lat = assignment.order.deliveryAddress.latitude;
            customerLocation.lon = assignment.order.deliveryAddress.longitude;
        }

        console.log(`✅ Current order found and returned for delivery boy`);
        
        return res.status(200).json({
            _id: assignment.order._id,
            user: assignment.order.user,
            shopOrder,
            deliveryAddress: assignment.order.deliveryAddress,
            deliveryBoyLocation,
            customerLocation,
        });

    } catch (error) {
        return res.status(500).json({ message: `error in get current order: ${error}` })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate("user")
            .populate({
                path: "shopOrders.shop",
                model: "Shop"
            })
            .populate({
                path: "shopOrders.assignedDeliveryBoy",
                model: "User"
            })
            .populate({
                path: "shopOrders.shopOrderItems.item",
                model: "Item"
            })
            .lean();
        if (!order) {
            return res.status(404).json({ message: "order not found" })
        }

        return res.status(200).json(order)

    } catch (error) {
        return res.status(500).json({ message: `error in get order by id: ${error}` })
    }
}

export const sendDeliveryOTP = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body;
        const order = await Order.findById(orderId).populate("user");
        const shopOrder = order.shopOrders.id(shopOrderId);
        if (!order || !shopOrder) {
            return res.status(404).json({ message: "Enter valid order or shop order id" })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        shopOrder.deliveryOtp = otp;
        shopOrder.otpExpires = Date.now() + 5 * 60 * 1000; //5 min
        await order.save();
        await sendDeliveryOtpMail(order.user, otp);
        return res.status(200).json({ message: `otp sent successfully ${order?.user?.fullname}` })

    } catch (error) {
        return res.status(500).json({ message: `error in send delivery otp: ${error}` })
    }
}

export const verifyDeliveryOTP = async (req, res) => {
    try {
        const { orderId, shopOrderId, otp } = req.body;
        const order = await Order.findById(orderId).populate("user");
        const shopOrder = order.shopOrders.id(shopOrderId);
        if (!order || !shopOrder) {
            return res.status(404).json({ message: "Enter valid order or shop order id" })
        }
        if (shopOrder.deliveryOtp !== otp || !shopOrder.otpExpires || shopOrder.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Enter valid OTP" })
        }
        shopOrder.status = "delivered";
        shopOrder.deliveredAt = Date.now()
        await order.save();

        await DeliveryAssignment.deleteOne({
            shopOrderId: shopOrder._id,
            order: order._id,
            assignedTo: shopOrder.assignedDeliveryBoy

        })

        return res.status(200).json({ message: "OTP verified successfully and order marked as delivered" })

    } catch (error) {
        return res.status(500).json({ message: `error in verify delivery otp: ${error}` })
    }
}


export const getTodayDeliveries = async (req, res) => {
    try {
        const deliveryBoyId = req.userId;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const orders = await Order.find({
            "shopOrders.assignedDeliveryBoy": deliveryBoyId,
            "shopOrders.status": "delivered",
            "shopOrders.deliveredAt": { $gte: startOfDay }
        }).lean()

        let todaysDeliveries = [];
        orders.forEach(order=>{
            order.shopOrders.forEach(shopOrder=>{
                if(shopOrder.assignedDeliveryBoy==deliveryBoyId && shopOrder.status=="delivered" && shopOrder.deliveredAt>=startOfDay){
                    todaysDeliveries.push(shopOrder)
                }
            })
        })

        let stats = {}

        todaysDeliveries.forEach(shopOrder=>{
            const hour = new Date(shopOrder.deliveredAt).getHours();
            stats[hour] = (stats[hour] || 0) + 1;
        })

        let formatedStats = Object.keys(stats).map(hour=>({
            hour:parseInt(hour),
            count: stats[hour],
        }))
    
         formatedStats.sort((a,b)=>a.hour-b.hour)

         return res.status(200).json(formatedStats)


    } catch (error) {
          return res.status(500).json({ message: `error in get today deliveries: ${error}` })
    }
}