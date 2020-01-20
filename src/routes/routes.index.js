// URL
const { server } = require("../config/config");
// Express Lib
const express = require("express");
// Routes lib
const router = express.Router();

// Defining the Index Routers
router.use(server.url + "profiles", require("./profiles"));
router.use(server.url + "expereinces", require("./experiences"));
router.use(server.url + "posts", require("./posts"));

// Exporting the Index Router
module.exports = router;
