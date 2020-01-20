// Config of the app - ENV
const config = require("./src/config/config");

// Requiring libs
const express = require("express");
const listEndpoints = require("express-list-endpoints");
const cors = require("cors");
// Log libs
const morgan = require("morgan");

const app = express();
const port = config.server.port || 5000;

app.use(cors());
app.use(express.json());

// Logs
app.use(morgan("dev"));

// Main Routing
app.use(require("./src/routes/routes.index"));

// If this run means the API works
app.use((req, res) => {
    res.status(404).send({
        route: req.originalUrl,
        message: "The API is up and running",
        info: "The endpoint may be not valid or you are in the Root"
    });
});

// Endpoints list
console.log(listEndpoints(app));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
