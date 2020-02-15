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
        const token = accessToken.split(" ")[1];

        // User and expiration
        let userId = "";
        let exp = "";

        // Token verification with user provided
        try {
            const d = await jwt.verify(token, Config.jwt.secret);

            userId = d.userId;
            exp = d.exp;
            // Check if token has expired
            if (exp < Date.now().valueOf() / 1000) {
                throw new ErrorHandlers.ErrorHandler(
                    401,
                    "JWT token has expired, please login to obtain a new one"
                );
            }
            // Logged in user find
            res.locals.loggedInUser = await User.findById(userId);
            res.locals.accessToken = token;
            next();
        } catch (err) {
            return res.status(401).json({ msg: "Token is not valid" });
        }
    } else {
        next();
    }
};
module.exports = accessToken;
