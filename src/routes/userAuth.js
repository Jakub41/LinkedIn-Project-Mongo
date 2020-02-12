// Express
const express = require("express");
// Router
const router = express.Router();
// Controller User Auth
const { UserCtrl, UserAuthCtrl } = require("../controllers");
// Auth middleware
const { Auth, Validation, isValidPsw } = require("../middlewares");
// Validation
const { check } = require("express-validator");

// Auth we specify that we only want to grant access to roles
// that are permitted to perform the specified action on the provided resource
// SignUp user register
router.post("/signup", UserAuthCtrl.signup);
// Login user access
router.post("/login", UserAuthCtrl.login);
// Password reset

// GET one user access
router.get(
    "/:userId",
    Auth.allowIfLoggedin,
    UserCtrl.getUser
);
// GET users roles access
router.get(
    "/",
    Auth.allowIfLoggedin,
    Auth.grantAccess("readAny", "user"),
    UserCtrl.getUsers
);
// PUT update user
router.put(
    "/:userId",
    Auth.allowIfLoggedin,
    Auth.grantAccess(["updateAny", "updateOwn"], "user"),
    UserCtrl.updateUser
);
// DELETE user
router.delete(
    "/:userId",
    Auth.allowIfLoggedin,
    Auth.grantAccess(["deleteAny", "deleteOwn"], "user"),
    UserCtrl.deleteUser
);

module.exports = router;
