// Express
const express = require("express");

// Controller
const { ExperiencesCtrl } = require("../controllers");

// Middleware CommonReq => common requests to get by id or username
// Allows to not write again same requests for common GET :params
const { CommonReq } = require("../middlewares");

// Upload Picture utility
const { Upload } = require("../utilities");

// Router
const router = express.Router();

// Experiences CRUD
router.get("/:username", CommonReq.getByUserName, ExperiencesCtrl.getAll);
router.get("/:username/experience/:experienceId", CommonReq.getByUserName, ExperiencesCtrl.getById);
router.post("/:username", CommonReq.getByUserName, ExperiencesCtrl.createNew);
router.patch("/:username/experience/:experienceId", CommonReq.getByUserName, ExperiencesCtrl.update);
router.delete("/:username/experience/:experienceId", CommonReq.getByUserName, ExperiencesCtrl.delete);



module.exports = router;
