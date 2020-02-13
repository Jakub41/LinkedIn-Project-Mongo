// ENV
const { Config } = require("../config");
// Utilities
const { ErrorHandlers } = require("../utilities");
// Model
const { User } = require("../models");
// JWT
const jwt = require("jsonwebtoken");

// Access token header
const accessToken = async (req, res, next) => {
    try {
        if (req.headers["authorization"]) {
            // Token from header Bearer in front
            // Getting off of it
            const accessToken = req.headers["authorization"];
            const token = accessToken.split(" ");
            const tk = token[1];
            console.log("TOKEN without Bearer >> ", tk);

            // User and expiration
            // let userid = "",
            //     exp = "";

            // Token verification with user provided
            const { userId } = await jwt.verify(tk, Config.jwt.secret);

            // Logged in user find
            res.locals.loggedInUser = await User.findById(userId);
            next();
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
    // Token pass in header as Bearer authorization
};

module.exports = accessToken;
