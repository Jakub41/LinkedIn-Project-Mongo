// Express
const express = require("express");
// Router
const router = express.Router();
// Controller User Auth
const { UserCtrl, UserAuthCtrl } = require("../controllers");
// Auth middleware
const { Auth } = require("../middlewares");
// Passport
const passport = require("passport");

// Auth we specify that we only want to grant access to roles
// that are permitted to perform the specified action on the provided resource
// SignUp user register
router.post("/signup", UserAuthCtrl.signup);

// Login user access
router.post("/login", UserAuthCtrl.login);

// GET one user access
router.get("/:userId", Auth.allowIfLoggedin, UserCtrl.getUser);

// load user if user has authorization token in header
router.get(
    "/loadUser/:token",
    Auth.allowIfLoggedin,
    UserAuthCtrl.loadUserWithToken
);

// GET users roles access
router.get(
    "/",
    Auth.allowIfLoggedin,
    Auth.grantAccess("readAny", "user"),
    UserCtrl.getUsers
);

// Reset password
// authorization token is required
router.post("/passwordReset", Auth.allowIfLoggedin, UserAuthCtrl.passwordReset);

// PUT update user
router.patch(
    "/:userId",
    Auth.allowIfLoggedin,
    Auth.grantAccess("updateOwn", "user"),
    UserCtrl.updateUser
);
// DELETE user
router.delete(
    "/:userId",
    Auth.allowIfLoggedin,
    Auth.grantAccess("deleteOwn", "user"),
    UserCtrl.deleteUser
);

// Facebook login
router.post("/fbLogin", passport.authenticate("fb"), UserAuthCtrl.fbLogin);

module.exports = router;
