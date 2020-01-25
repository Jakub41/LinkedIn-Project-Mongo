const { ErrorHandlers } = require("../utilities");

const errors = (err, req, res, next) => {
    ErrorHandlers.handleError(err, res);
};

module.exports = errors;
