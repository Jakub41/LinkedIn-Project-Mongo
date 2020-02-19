// Env
const { Config } = require("../config");
// Error
const { ErrorHandlers } = require("../utilities");
// User model
const { User } = require("../models");

// User controller
const UserController = {
    // GET all the users
    async getUsers(req, res, next) {
        // Find users
        const users = await User.find({});
        const usersCount = await User.countDocuments();
        // Failed throw error
        if (!users)
            throw new ErrorHandlers.ErrorHandler(
                404,
                "No users have been found"
            );
        // Response
        res.status(200).json({ usersCount: usersCount, users: users });
    },

    // GET user
    async getUser(req, res, next) {
        try {
            // UserID param
            const userId = req.params.userId;
            // Find user by Id
            const user = await User.findById(userId);
            // No user error
            if (!user)
                return next(
                    new ErrorHandlers.ErrorHandler(404, "User not found")
                );
            // Response
            res.status(200).json({ user: user });
        } catch (err) {
            next(err);
        }
    },

    // UPDATE user
    async updateUser(req, res, next) {
        try {
            // Check permission to operation
            const user = res.locals.loggedInUser;

            console.log("USER ID LOGGED", user._id);

            if (user._id !== req.params.userId) {
                throw next(
                    new ErrorHandlers.ErrorHandler(401, "Permission denied")
                );
            }

            // Check for empty req.body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to update");
            } else {
                // Find id and update the fields
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: req.params.userId },
                    req.body,
                    (err, response) => {
                        return response;
                    }
                );

                // Error check
                if (!updatedUser) {
                    throw next(
                        new ErrorHandlers.ErrorHandler(400, "Update failed")
                    );
                }

                // Send result
                res.json({ message: "User updates", updatedUser });
            }
        } catch (err) {
            next(err);
        }
    },

    // DELETE user
    async deleteUser(req, res, next) {
        try {
            // UserId param
            const userId = req.params.userId;

            // Check who is deleting
            const user = res.locals.loggedInUser;

            if (user._id !== userId) {
                throw next(
                    new ErrorHandlers.ErrorHandler(401, "Permission denied")
                );
            }

            // Find the user and delete
            await User.findByIdAndDelete(userId);
            // Response
            res.status(200).json({
                user: null,
                message: "User has been deleted"
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = UserController;
