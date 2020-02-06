// model
const { Profile, Post } = require("../models");
// Error handling
const { ErrorHandlers } = require("../utilities");

// Posts Controller
const PostsController = {
    // Get all posts
    async getAll(req, res) {
        try {
            // Finding all the Posts & count
            const posts = await Post.find({});
            const postsCount = await Post.countDocuments();

            // Checking Posts from DB
            if (posts.length === 0) {
                throw new ErrorHandlers.ErrorHandler(
                    400,
                    "No posts were found"
                );
            }

            // response
            res.status(200).json({ count: postsCount, posts });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getAllFromProfile(req, res) {
        try {
            const postsFromUsername = await Profile.aggregate([
                {
                    $match: {
                        username: res.username.username
                    }
                },
                {
                    $lookup: {
                        from: "posts",
                        localField: "username",
                        foreignField: "username",
                        as: "posts"
                    }
                },
                {
                    $project: {
                        username: 1,
                        posts: 1,
                        postsCount: {
                            $size: "$posts"
                        },
                        _id: 0
                    }
                }
            ]);

            if (postsFromUsername.length > 0) {
                res.json({ postsFromUsername: postsFromUsername });
            } else {
                throw new ErrorHandlers.ErrorHandler(500, "No data");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Create a new one for the username
    async createNew(req, res) {
        try {
            // Check for an empty body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to create");
            }

            // Req body
            const newPost = req.body;

            // Creating the new post and updating the profile ref
            const addNewPost = await Post.create(newPost);
            addNewPost.username = req.body.username;

            const updateProfile = await Profile.findOneAndUpdate(
                { username: res.username.username },
                { $push: { posts: addNewPost._id } },
                { new: true }
            );

            // Error Check
            if (!addNewPost && !updateProfile) {
                throw new ErrorHandlers.ErrorHandler(
                    500,
                    "Not possible create a new post"
                );
            }

            // Response
            res.status(200).json({
                username: res.username.username,
                newPost: newPost
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async delete(req,res) {

    }
};

module.exports = PostsController;
