// ENV
const { Config } = require("../config");
// Utilities
const { ErrorHandlers } = require("../utilities");
// JWT
const jwt = require("jsonwebtoken");
// Model
const { User } = require("../models");

// Access token header
const accessToken = async (req, res, next) => {
    // Token pass in header
    if (req.headers["x-access-token"]) {
        // Token from header
        const accessToken = req.headers["x-access-token"];
        // Token verification with user provided
        const { userId, exp } = await jwt.verify(
            accessToken,
            Config.jwt.secret
        );
        // Check if token has expired
        if (exp < Date.now().valueOf() / 1000) {
            throw new ErrorHandlers.ErrorHandler(
                401,
                "JWT token has expired, please login to obtain a new one"
            );
        }
        // Logged in user find
        res.locals.loggedInUser = await User.findById(userId);
        next();
    } else {
        next();
    }
};

module.exports = accessToken;
