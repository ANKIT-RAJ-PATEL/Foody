import User from "./models/usermodel.js";


export const socketHandler = function (io) {
    io.on("connection", (socket) => {
        console.log("🔌 New socket connection:", socket.id);

        socket.on("identity", async ({ userId }) => {
            try {
                console.log(`👤 Identity received - User ID: ${userId}, Socket ID: ${socket.id}`);
                
                const user = await User.findByIdAndUpdate(userId, {
                    socketId: socket.id,
                    isOnline: true,
                }, { new: true });
                
                if (user) {
                    // Join a room specific to this user for targeted messaging
                    socket.join(`user_${userId}`);
                    console.log(`✅ User ${user.fullname} (${user.role}) connected - Room: user_${userId}`);
                } else {
                    console.log(`⚠️ User not found: ${userId}`);
                }
            } catch (error) {
                console.log("❌ Socket identity error:", error.message);
            }
        });


        socket.on("updateLocation", async ({ latitude, longitude, userId }) => {
            try {
                console.log(`📍 Location update - User: ${userId}, Lat: ${latitude}, Lon: ${longitude}`);
                
                const user = await User.findByIdAndUpdate(userId, {
                    location: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    isOnline: true,
                    socketId: socket.id,
                }, { new: true });
                
                if (user) {
                    // Broadcast location update to all clients tracking this delivery boy
                    io.emit("updateDeliveryLocation", {
                        deliveryBoyId: userId,
                        latitude,
                        longitude,
                    });
                    console.log(`✅ Location broadcasted for delivery boy: ${user.fullname}`);
                } else {
                    console.log(`⚠️ User not found for location update: ${userId}`);
                }

            } catch (error) {
                console.log("❌ Update delivery location error:", error.message);
            }
        });

        socket.on("disconnect", async () => {
            try {
                const user = await User.findOneAndUpdate({ socketId: socket.id }, {
                    socketId: null,
                    isOnline: false,
                }, { new: true });
                
                if (user) {
                    console.log(`🔌 User disconnected: ${user.fullname} (${socket.id})`);
                } else {
                    console.log(`🔌 Socket disconnected: ${socket.id}`);
                }
            } catch (error) {
                console.log("❌ Socket disconnect error:", error.message);
            }
        });

        socket.on("error", (error) => {
            console.log("❌ Socket error:", socket.id, error);
        });
    });

    io.on("connect_error", (error) => {
        console.log("❌ Socket.IO connection error:", error);
    });
}