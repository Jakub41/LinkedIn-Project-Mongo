// Config of the app - ENV
const { Config } = require("./src/config");
const path = require("path");

// Middleware
const { Errors, ServerStatus } = require("./src/middlewares");
const Err = require("./src/utilities");

// Requiring libs
const express = require("express");
const listEndpoints = require("express-list-endpoints");
const cors = require("cors");

// Log libs
const morgan = require("morgan");

const app = express();
const port = Config.server.port || 5000;

// Passport lib
const passport = require("passport");

// Cors
app.use(cors());

// Public to upload files
app.use(express.static(path.join(__dirname, "./public")));

// JSON
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// Passport init
app.use(passport.initialize());

// Logs
app.use(morgan("dev"));

// Auth

// Main Routing
app.use(require("./src/routes"));

// Test error handler
app.get("/error", (req, res) => {
    throw new Err.ErrorHandlers.ErrorHandler(500, "Internal server error");
});

// If this run means the API works
app.use(ServerStatus);

// Endpoints list
console.log(listEndpoints(app));

// Error handling
app.use(Errors);

app.listen(port, () => {
    console.log(`> Server is running on port: ${port}`);
});
