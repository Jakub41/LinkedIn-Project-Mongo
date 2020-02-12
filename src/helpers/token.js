// RNV
const { Config } = require("../config");
// JWT
const jwt = require("jsonwebtoken");

// Token helper
module.exports = {
    getToken: user => jwt.sign(user, Config.jwt.secret, { expiresIn: Config.jwt.expiration })
};
