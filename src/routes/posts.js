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
router.get("/:id", CommonReq.getById, PostsCtrl.getAllFromProfile);
router.post("/:id", CommonReq.getById, PostsCtrl.createNew);
router.patch("/:id/post/:postId", CommonReq.getById, PostsCtrl.update);
router.delete("/:id/post/:postId", CommonReq.getById, PostsCtrl.delete);

module.exports = router;
