const { ErrorHandlers } = require("../utilities");

const errors = (err, req, res, next) => {
    return ErrorHandlers.handleError(err, res);
};

module.exports = errors;
