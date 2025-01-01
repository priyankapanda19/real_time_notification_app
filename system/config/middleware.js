const originWhitelist = [
    "http://localhost:8083",
    "file:///C:/Users/HP/Desktop/real-time-notifications/test.html",
];

function checkCorsOrigin(origin, callback) {
    if (originWhitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
    } else {
        callback(new Error("Not allowed by CORS"));
    }
}

const cors = {
    origin: checkCorsOrigin,
    allowedHeaders:
        "Origin,X-Requested-With,Content-Type,Accept,Authorization,stripe-signature",
    methods: "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS",
    optionsSuccessStatus: 204,
};

const morganRequestFormat = function (tokens, req, res) {
    return `[${[
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens["response-time"](req, res),
    ].join("][")}]`;
};

module.exports = {
    cors,
    morganRequestFormat,
};
