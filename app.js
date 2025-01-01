const dotenv = require("dotenv");

switch (process.env.NODE_ENV) {
    case "production":
        dotenv.config({ path: "./production.env" });
        break;
    case "staging":
        dotenv.config({ path: "./staging.env" });
        break;
    case "development":
        dotenv.config({ path: "./dev.env" });
        break;
    default:
        dotenv.config({ path: "./local.env" });
        break;
}

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const boom = require("@hapi/boom");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const middlewareConfig = require("./system/config/middleware");
const logError = require("./system/middleware/log-error");
const errorHandler = require("./system/error/handler");
const { getConnection } = require("./system/db/mongo");
const userRoutes = require("./api/Users/route");
const notificationRoutes = require("./api/Notifications/route");
const socketManager = require("./system/utils/socket-manager");

app.use(cors(middlewareConfig.cors));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan(middlewareConfig.morganRequestFormat));

app.get("/", (req, res) => {
    console.log(`Health is A OK .ENV  ==>> ${process.env.NODE_ENV}`);
    res.send({ msg: `Health is A OK .ENV  ==>> ${process.env.NODE_ENV}` });
});

//Connection Establish
getConnection();

//socket connection
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

socketManager.initialize(io);

//routes
app.use("/api", userRoutes);
app.use("/api", notificationRoutes);

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
    throw boom.notFound("Endpoint Not Found");
});

app.use(logError);
app.use(errorHandler.token);
app.use(errorHandler.validation);
app.use(errorHandler.all);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Is Running On ${PORT}`);
});

module.exports = app;
