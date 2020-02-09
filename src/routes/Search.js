// Express
const express = require("express");
// Controller
const { SearchCtrl } = require("../controllers");
// Router
const router = express.Router();

// Post CRUD
router.get("/", SearchCtrl.getQuery);

module.exports = router;
