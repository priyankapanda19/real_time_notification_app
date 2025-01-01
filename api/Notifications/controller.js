const notificationService = require("./service");

const createNotification = async (req) => {
    try {
        const { message, recipient, recipientRole } = req.body;
        const senderId = req.user._id;

        if (recipientRole) {
            const notifications =
                await notificationService.sendNotificationToRole(
                    senderId,
                    recipientRole,
                    message,
                );
            return {
                message: "Notifications sent successfully",
                data: notifications,
            };
        }

        const notificationData = {
            message,
            sender: senderId,
            recipient,
        };

        const newNotification = await notificationService.createNotification(
            notificationData,
        );

        return {
            message: "Notification sent successfully",
            data: newNotification,
        };
    } catch (error) {
        console.error("Error creating notification:", error.message);
        throw new Error("Failed to send notification.");
    }
};

const sendToUser = async (req) => {
    const status = await notificationService.sendNotificationToUser(
        req.user.userId,
        req.params.id,
        req.body.message,
    );
    return { message: "User Notify", status };
};

const sendToRole = async (req) => {
    const data = await notificationService.sendNotificationToRole(
        req.user.userId,
        req.params.role,
        req.body.message,
    );
    return { message: "Notify By Role", data };
};

const getUnreadNotifications = async (req) => {
    const data = await notificationService.getUnreadNotifications(
        req.user.userId,
    );
    return { message: "Unread Notifications", data };
};

const markNotificationsRead = async (req) => {
    try {
        const userId = req.user.userId;
        const { notificationIds } = req.body;

        if (!notificationIds || !Array.isArray(notificationIds)) {
            throw new Error("Valid notification IDs array is required.");
        }

        await notificationService.markNotificationsAsRead(
            userId,
            notificationIds,
        );

        return {
            message: "Notifications marked as read successfully",
            data: null,
        };
    } catch (error) {
        console.error("Error marking notifications as read:", error.message);
        throw new Error("Failed to mark notifications as read.");
    }
};

module.exports = {
    createNotification,
    markNotificationsRead,
    sendToUser,
    sendToRole,
    getUnreadNotifications,
};
