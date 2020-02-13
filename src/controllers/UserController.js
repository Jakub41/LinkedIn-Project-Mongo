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
            // Check empty req.body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to update");
            }
            // Body to update
            const update = req.body;
            // UserId to update
            const userId = req.params.userId;
            // Finding the user to update
            await User.findByIdAndUpdate(userId, update);
            // Updated user
            const user = await User.findById(userId);
            // Response
            res.status(200).json({
                user: user,
                message: "User has been updated"
            });
        } catch (error) {
            next(error);
        }
    },

    // DELETE user
    async deleteUser(req, res, next) {
        try {
            // UserId param
            const userId = req.params.userId;
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
