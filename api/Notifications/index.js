const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipientRole: {
            type: String,
            enum: ["admin", "moderator", "user"],
            required: false,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Notification", NotificationSchema);
