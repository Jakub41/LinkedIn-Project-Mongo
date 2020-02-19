// Error utility
// Roles utility => basic, moderator and admin
const { Roles, ErrorHandlers } = require("../utilities");
const { promisify } = require("util");
// user Modal
const { User } = require("../models");

const { Config } = require("../config");

// JWT
const jwt = require("jsonwebtoken");

// Allowing access to right role permission
const grantAccess = (...para) => {
    return (req, res, next) => {
        if (!para.includes(req.user.role)) {
            throw new ErrorHandlers.ErrorHandler(
                401,
                "You don't have enough permission to perform this action"
            );
        }
        next();
    };
};

// Allow if user logged in
const allowIfLoggedin = async (req, res, next) => {
    try {
        //check the authorization header
        if (!req.headers.authorization) {
            throw new ErrorHandlers.ErrorHandler(
                401,
                "Please provide the authorization header"
            );
        }
        const token = req.headers.authorization.split(" ")[1];
        // if token not provides
        if (!token) {
            throw new ErrorHandlers.ErrorHandler(
                401,
                "you are not login in please login first"
            );
        }
        //verify is async that why use promisify
        const verify = await promisify(jwt.verify)(token, Config.jwt.secret);

        if (Date.now() >= verify.exp * 1000) {
            throw new ErrorHandlers.ErrorHandler(
                401,
                "Your token is expired. Please login again to get the new token"
            );
        }

        const currentUser = await User.findById(verify.userId).populate(
            "profile"
        );
        if (!currentUser) {
            throw new ErrorHandlers.ErrorHandler(
                401,
                "Your provided token is not related to any user"
            );
        }
        // check for update password date and token creation date
        if (
            currentUser.passwordCreatedAt &&
            verify.iat <
                parseInt(currentUser.passwordCreatedAt.getTime() / 1000)
        ) {
            throw new ErrorHandlers.ErrorHandler(
                401,
                "Please login yourself with updated password"
            );
        }

        req.user = currentUser;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { grantAccess, allowIfLoggedin };
