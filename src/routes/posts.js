// Express
const express = require("express");
// Controller
const { PostsCtrl } = require("../controllers");
// Common req
const { CommonReq } = require("../middlewares");
// Router
const router = express.Router();

// To test if all running ok
router.get("/", PostsCtrl.getAll);
router.get("/:username", CommonReq.getByUserName, PostsCtrl.getAllFromProfile);
router.post("/:username", CommonReq.getByUserName, PostsCtrl.createNew);

module.exports = router;
