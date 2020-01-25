// API URL ENV
const { Config } = require("../config");
const BaseURL = Config.server.url;
// Express Lib
const express = require("express");
// Routes lib
const router = express.Router();

// Defining the Index Routers
router.use(BaseURL + "profiles", require("./profiles"));
router.use(BaseURL + "experiences", require("./experiences"));
router.use(BaseURL + "posts", require("./posts"));

// Exporting the Index Router
module.exports = router;
