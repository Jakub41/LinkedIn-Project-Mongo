const { Config } = require("../config");
const jwt = require("jsonwebtoken");

module.exports = {
    getToken: user => jwt.sign(user, Config.jwt.secret, { expiresIn: Config.jwt.expiration })
};
