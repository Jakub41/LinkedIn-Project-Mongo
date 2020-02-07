const { Profile, Post } = require("../models");
const { ErrorHandlers } = require("../utilities");

const CommonRequestsMiddleware = {
    async getById(req, res, next) {
        try {
            id = await Profile.findById(req.params.id);
            if (!id) {
                throw new ErrorHandlers.ErrorHandler(
                    404,
                    `No Id ${req.params.id} have been found`
                );
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }

        res.id = id;
        next();
    },

    async getByUserName(req, res, next) {
        try {
            username = await Profile.findOne({
                username: req.params.username
            });
            if (!username) {
                throw new ErrorHandlers.ErrorHandler(
                    404,
                    `No UserName ${req.params.username} have been found`
                );
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }

        res.username = username;
        next();
    },

    async getPostById(req, res, next) {
        try {
            id = await Post.findById(req.params.postId);
            if (!id) {
                throw new ErrorHandlers.ErrorHandler(
                    404,
                    `No Id ${req.params.id} have been found`
                );
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }

        res.id = id;
        next();
    }
};

module.exports = CommonRequestsMiddleware;
