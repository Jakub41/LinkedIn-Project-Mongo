const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Passport } = require("../../utilities");
const { UserAuthCtrl } = require("../../controllers");

//setup configuration for facebook login
Passport();

router
    .route("/facebook")
    .post(
        passport.authenticate("facebookToken", { session: false }),
        UserAuthCtrl.facebookOAuth
    );

module.exports = router;
