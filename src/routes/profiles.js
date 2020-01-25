// Express
const express = require("express");
// Controller
const { ProfilesCtrl } = require("../controllers");

// Router
const router = express.Router();

// GET all the profiles => <URL>/api/v1/profiles
router.get("/", ProfilesCtrl.getAll);
// POST creates a new profile => <url>api/v1/profiles
router.post("/", ProfilesCtrl.createNew);

module.exports = router;
