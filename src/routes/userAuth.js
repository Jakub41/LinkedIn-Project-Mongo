// Express
const express = require("express");
// Router
const router = express.Router();
// Controller User Auth
const { UserCtrl, UserAuthCtrl } = require("../controllers");
// Auth middleware
const { Auth } = require("../middlewares");

// Auth we specify that we only want to grant access to roles
// that are permitted to perform the specified action on the provided resource
// SignUp user register
router.post("/signup", UserAuthCtrl.signup);
// Login user access
router.post("/login", UserAuthCtrl.login);
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
    Auth.grantAccess("readAny", "profile"),
    UserCtrl.getUsers
);
// PUT update user
router.put(
    "/:userId",
    Auth.allowIfLoggedin,
    Auth.grantAccess("updateAny", "profile"),
    UserCtrl.updateUser
);
// DELETE user
router.delete(
    "/:userId",
    Auth.allowIfLoggedin,
    Auth.grantAccess("deleteAny", "profile"),
    UserCtrl.deleteUser
);

module.exports = router;
