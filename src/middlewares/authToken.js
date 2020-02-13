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
    // Token pass in header as Bearer authorization
    if (req.headers["authorization"]) {
        // Token from header Bearer in front
        // Getting off of it
        const accessToken = req.headers["authorization"];
        const token = accessToken.split(" ");
        const tk = token[1];
        console.log("TOKEN without Bearer >> ", tk);

        // User and expiration
        let userid = "";
        let exp = "";

        // Token verification with user provided
        jwt.verify(tk, Config.jwt.secret, (err, d) => {
            // If token is expired or else error is thrown out
            if (err) return next(new ErrorHandlers.ErrorHandler(500, err));

            userid = d.userId;
            exp = d.exp;
        });

        // Logged in user find
        res.locals.loggedInUser = await User.findById(userid);
        next();
    } else {
        next();
    }
};

module.exports = accessToken;
