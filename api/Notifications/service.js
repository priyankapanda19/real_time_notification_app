const Notification = require("./index");
const User = require("../Users/index");
const socketManager = require("../../system/utils/socket-manager");

const createNotification = async (notificationData) => {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification.populate("sender recipient", "username role");
};

const getNotificationById = async (id) => {
    return await Notification.findById(id).populate(
        "sender recipient",
        "username role",
    );
};

const getUserNotifications = async (userId) => {
    return await Notification.find({
        recipient: userId,
        isRead: false,
    })
        .populate("sender", "username role")
        .sort("-createdAt");
};

const markNotificationsAsRead = async (userId, notificationIds) => {
    return await Notification.updateMany(
        {
            _id: { $in: notificationIds },
            recipient: userId,
        },
        { $set: { isRead: true } },
    );
};

const getUnreadNotifications = async (userId) => {
    return await Notification.find({
        recipient: userId,
        isRead: false,
    })
        .populate("sender", "username")
        .sort("-createdAt");
};

const sendNotificationToRole = async (senderId, role, message) => {
    const users = await User.find({ role });
    const notifications = await Notification.insertMany(
        users.map((user) => ({
            sender: senderId,
            recipient: user._id,
            recipientRole: role,
            message,
        })),
    );

    const populatedNotifications = await Notification.populate(notifications, {
        path: "sender recipient",
        select: "username role",
    });

    users.forEach((user) => {
        const userNotification = populatedNotifications.find(
            (n) => n.recipient._id.toString() === user._id.toString(),
        );
        if (userNotification) {
            socketManager.emitToUser(
                user._id,
                "notification:receive",
                userNotification,
            );
        }
    });

    return populatedNotifications;
};

const sendNotificationToUser = async (senderId, recipientId, message) => {
    const recipient = await User.findById(recipientId);
    const notifications = await createNotification({
        sender: senderId,
        recipient: recipientId,
        recipientRole: recipient?.role,
        message,
    });

    const populatedNotifications = await Notification.populate(notifications, {
        path: "sender recipient",
        select: "username role",
    });

    const status = socketManager.emitToUser(
        recipientId,
        "notification:receive",
        notifications,
    );

    return populatedNotifications;
};

module.exports = {
    createNotification,
    getNotificationById,
    getUserNotifications,
    markNotificationsAsRead,
    sendNotificationToRole,
    getUnreadNotifications,
    sendNotificationToUser,
};
