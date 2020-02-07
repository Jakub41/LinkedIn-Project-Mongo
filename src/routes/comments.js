// Express
const express = require("express");

// Controller
const { CommentsCtrl } = require("../controllers");

// Middleware CommonReq => common requests to get by id or username
// Allows to not write again same requests for common GET :params
const { CommonReq } = require("../middlewares");

// Router
const router = express.Router();

// CRUD
router.get("/", CommentsCtrl.getAll);
router.get("/:postId", CommonReq.getPostById , CommentsCtrl.getPostAllComments);
router.get("/:postId/comment/:commentId", CommonReq.getPostById , CommentsCtrl.getProfileOneComment);
router.post("/:postId", CommonReq.getPostById , CommentsCtrl.createNew);

module.exports = router;
