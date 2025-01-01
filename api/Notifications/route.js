const express = require("express");
const router = express.Router();
const c = require("../../system/utils/controller-handler.js");
const {
    authenticateToken,
    authorizeRole,
} = require("../../system/middleware/auth");
const {
    markNotificationsRead,
    getUnreadNotifications,
    sendToRole,
    sendToUser,
} = require("./controller");

router.post(
    "/notify/user/:id",
    authenticateToken,
    authorizeRole(["admin", "moderator"]),
    c(sendToUser, (req, res, next) => [req]),
);

router.post(
    "/notify/role/:role",
    authenticateToken,
    authorizeRole(["admin"]),
    c(sendToRole, (req, res, next) => [req]),
);

router.get(
    "/notifications",
    authenticateToken,
    c(getUnreadNotifications, (req, res, next) => [req]),
);

router.put(
    "/notifications/mark-read",
    authenticateToken,
    c(markNotificationsRead, (req, res, next) => [req]),
);

module.exports = router;
