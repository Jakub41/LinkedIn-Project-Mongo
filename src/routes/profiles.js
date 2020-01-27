// Express
const express = require("express");

// Controller
const { ProfilesCtrl } = require("../controllers");

// Middleware CommonReq => common requests to get by id or username
// Allows to not write again same requests for common GET :params
const { CommonReq } = require("../middlewares");

// Upload Picture utility
const { Upload } = require("../utilities");

// Router
const router = express.Router();

// GET all the profiles => <URL>/api/v1/profiles
router.get("/", ProfilesCtrl.getAll);

// GET one profile by ID => <URL>/api/v1/profiles/:id
router.get("/:id", CommonReq.getById, ProfilesCtrl.getByUserId);

// GET one profile by userName => <URL>/api/v1/profiles/:username
router.get(
    "/username/:username",
    CommonReq.getByUserName,
    ProfilesCtrl.getByUserName
);

router.get(
    "/username/:username",
    CommonReq.getByUserName,
    ProfilesCtrl.getByUserName
);

// GET Profile CV as PDF => <URL>/api/v1/profiles/:username/cv-pdf
router.get("/:username/cv-pdf", CommonReq.getByUserName, ProfilesCtrl.getCvPdf);

// POST creates a new profile => <url>api/v1/profiles
router.post("/", ProfilesCtrl.createNew);

// PATCH updates just the fields we need instead of PUT which updates the whole chunk
router.patch("/:id", CommonReq.getById, ProfilesCtrl.update);

// DELETE removes a profile by ID => <url>api/v1/profiles/:id
router.delete("/:id", CommonReq.getById, ProfilesCtrl.delete);

module.exports = router;
