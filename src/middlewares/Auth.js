// Error utility
// Roles utility => basic, moderator and admin
const { Roles, ErrorHandlers } = require("../utilities");

// Allowing access to right role permission
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            console.log(req.user.role);
            // Permission to perform the specified action of the provided resource
            const permission = Roles.roles.can(req.user.role)[action](resource);
            // No permission => 401
            if (!permission.granted) {
                throw new ErrorHandlers.ErrorHandler(
                    401,
                    "You don't have enough permission to perform this action"
                );
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

// Allow if user logged in
const allowIfLoggedin = async (req, res, next) => {
    try {
        console.log("LOCALS", JSON.stringify(res.locals));
        const user = res.locals.loggedInUser;
        if (!user)
            throw new ErrorHandlers.ErrorHandler(
                401,
                "You need to be logged in to perform this operation"
            );
        // User
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { grantAccess, allowIfLoggedin };
