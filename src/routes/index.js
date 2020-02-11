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
router.use(BaseURL + "comments", require("./comments"));
router.use(BaseURL + "search", require("./Search"));
router.use(BaseURL + "user", require("./userAuth"));

// Exporting the Index Router
module.exports = router;
