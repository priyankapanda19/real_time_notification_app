const jwt = require("jsonwebtoken");
const User = require("../../api/Users/index");
const Notification = require("../../api/Notifications/index");

// State management
const connectedUsers = new Map();
let io = null;
// Initialize socket connection
const initialize = (socketIo) => {
    io = socketIo;

    // Set up authentication middleware
    io.use(async (socket, next) => {
        try {
            const token =
                socket.handshake.auth.token || socket.handshake.query.token;

            if (!token) {
                return next(new Error("Authentication token is required"));
            }

            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database
            const user = await User.findById(decoded._id).select("-password");

            if (!user) {
                return next(new Error("User not found"));
            }

            // Attach user to socket
            socket.user = user;
            next();
        } catch (error) {
            console.error("Socket authentication error:", error.message);
            next(new Error("Authentication failed"));
        }
    });

    setupSocketHandlers();
};

const setupSocketHandlers = () => {
    io.on("connection", async (socket) => {
        try {
            const userId = socket.user._id.toString();
            console.log(`User connected: ${userId}`);

            // Handle connection
            await handleConnection(socket, userId);

            // Handle disconnection
            socket.on("disconnect", async () => {
                await handleDisconnection(userId);
                console.log(`User disconnected: ${userId}`);
            });

            // Handle notification acknowledgment
            socket.on("notification:acknowledge", async (notificationId) => {
                await handleNotificationAcknowledgment(userId, notificationId);
            });

            // Handle errors
            socket.on("error", (error) => {
                console.error("Socket error:", error.message);
            });
        } catch (error) {
            console.error("Socket connection error:", error.message);
            socket.disconnect(true);
        }
    });
};

const handleConnection = async (socket, userId) => {
    try {
        // Store socket connection
        connectedUsers.set(userId, socket);

        // Update user's online status
        await updateUserOnlineStatus(userId, true);

        // Send initial data to user
        socket.emit("connection:success", {
            message: "Successfully connected to WebSocket server",
        });

        // Join user to their private room
        socket.join(`user:${userId}`);

        // Notify admins/moderators
        emitToRole("admin", "user:online", {
            userId,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error("Error handling connection:", error.message);
        socket.disconnect(true);
    }
};

const handleDisconnection = async (userId) => {
    try {
        // Remove socket connection
        connectedUsers.delete(userId);

        // Update user's online status
        await updateUserOnlineStatus(userId, false);

        // Notify admins/moderators
        emitToRole("admin", "user:offline", {
            userId,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error("Error handling disconnection:", error.message);
    }
};

const handleNotificationAcknowledgment = async (userId, notificationId) => {
    try {
        await Notification.findByIdAndUpdate(notificationId, {
            isRead: true,
            readAt: new Date(),
        });
    } catch (error) {
        console.error(
            "Error handling notification acknowledgment:",
            error.message,
        );
    }
};

const emitToUser = (userId, event, data) => {
    try {
        const socket = connectedUsers.get(userId.toString());
        if (socket) {
            socket.emit(event, data);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error emitting to user:", error.message);
        return false;
    }
};

const emitToRole = async (role, event, data) => {
    try {
        const users = await User.find({ role });
        users.forEach((user) => {
            emitToUser(user._id, event, data);
        });
        return true;
    } catch (error) {
        console.error("Error emitting to role:", error.message);
        return false;
    }
};

const emitToAll = (event, data) => {
    try {
        io.emit(event, data);
        return true;
    } catch (error) {
        console.error("Error emitting to all:", error.message);
        return false;
    }
};

const getConnectedUsers = () => {
    return Array.from(connectedUsers.keys());
};

const isUserConnected = (userId) => {
    return connectedUsers.has(userId.toString());
};

const updateUserOnlineStatus = async (userId, isOnline) => {
    try {
        await User.findByIdAndUpdate(userId, {
            isOnline,
            lastSeen: new Date(),
        });
    } catch (error) {
        console.error("Error updating user online status:", error.message);
    }
};

// Export all functions
module.exports = {
    initialize,
    emitToUser,
    emitToRole,
    emitToAll,
    getConnectedUsers,
    isUserConnected,
};
