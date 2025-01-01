/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const mongoose = require("mongoose");
let dbConn = "";

const getConnection = async () => {
    const MONGO_CONN_STRING = process.env.MONGO_CONN_STRING;
    if (MONGO_CONN_STRING !== null) {
        dbConn = await mongoose.connect(
            `${MONGO_CONN_STRING}${process.env.MONGO_DB_NAME}?authSource=${process.env.MONGO_AUTH_SOURCE}&ssl=true`,
        );
        console.log(`Mongo Connection Established`);
        return dbConn;
    }
    console.log("Connection Not Found!");
    return false;
};

async function closeDbConn() {
    try {
        await mongoose.disconnect();
        conn = null;
        environment = null;
        apiEnv = null;
        console.log("Connection closed");
    } catch (error) {
        console.error("Error closing the database connection:", error);
    }
}

module.exports = {
    getConnection,
    closeDbConn,
    dbConn,
};
