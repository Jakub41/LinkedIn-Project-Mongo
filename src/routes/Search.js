// Express
const express = require("express");
// Controller
const { SearchCtrl } = require("../controllers");
// Auth middleware
const { Auth } = require("../middlewares");
// Router
const router = express.Router();

// Post CRUD
router.get("/", Auth.allowIfLoggedin, SearchCtrl.getQuery);

module.exports = router;
