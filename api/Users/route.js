const express = require("express");
const router = express.Router();
const c = require("../../system/utils/controller-handler.js");
const {
    authenticateToken,
    authorizeRole,
} = require("../../system/middleware/auth");
const { UserSchemaValidation, LoginSchemaValidation } = require("./schema");
const {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    login,
} = require("./controller");

router.post(
    "/user",
    UserSchemaValidation,
    c(createUser, (req, res, next) => [req]),
);

router.post(
    "/login",
    LoginSchemaValidation,
    c(login, (req, res, next) => [req]),
);

router.get(
    "/user/:id",
    authenticateToken,
    c(getUserById, (req, res, next) => [req]),
);

router.put(
    "/user/:id",
    authenticateToken,
    UserSchemaValidation,
    c(updateUser, (req, res, next) => [req]),
);

router.delete(
    "/user/:id",
    authenticateToken,
    authorizeRole(["admin"]),
    c(deleteUser, (req, res, next) => [req]),
);

module.exports = router;
