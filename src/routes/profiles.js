// Express
const express = require("express");
// model
// const db = require("../models/models.index");
// Router
const router = express.Router();

// To test if all running ok
router.get("/", async (req, res) => {
    res.send('profiles endpoint!');
});

module.exports = router;
