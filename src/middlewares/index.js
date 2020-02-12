// Here the middleware
module.exports = {
    Errors: require("./errors"),
    ServerStatus: require("./serverStatus"),
    CommonReq: require("./commonRequests"),
    AuthToken: require("./authToken"),
    Auth: require("./Auth"),
    Validation: require("./validator"),
    isValidPsw: require("./isValidPsw")
};
