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
            // Getting all the posts of one profile
            const postsFromUsername = await Profile.aggregate([
                {
                    // Find match by ID of the profile
                    $match: {
                        _id: res.id._id
                    }
                },
                {
                    // Looking for a match between 2 collections
                    // by profile on Post and foreign username on Profile collection
                    // left outer join
                    $lookup: {
                        from: "posts",
                        localField: "profile",
                        foreignField: "username",
                        as: "posts"
                    }
                },
                {
                    // Fields to show on response
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

            // Check and result
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
            // Req param
            const profileId = res.id._id;

            // Req body
            const newPost = req.body;

            // Creating the new post and updating the profile ref
            const addNewPost = await Post.create(newPost);

            // Updating Post with profile ID
            const updateIDPost = await Post.findOneAndUpdate(
                { _id: addNewPost._id },
                { $set: { profile: profileId } }
            );

            // Error check
            if (!updateIDPost) {
                throw new ErrorHandlers.ErrorHandler(
                    500,
                    "Profile ID cannot be saved"
                );
            }

            // Updating the profile posts[id]
            const updateProfile = await Profile.findOneAndUpdate(
                { _id: res.id._id },
                { $push: { posts: addNewPost._id } },
                { new: true }
            );

            // Error Check
            if (addNewPost.length === 0 && updateProfile.lenght === 0) {
                throw new ErrorHandlers.ErrorHandler(
                    500,
                    "Not possible to create a new post"
                );
            }

            // Response
            res.status(200).json({
                _id: res.id._id,
                newPost: newPost
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async update(req, res) {
        try {
            // Check for an empty body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to create");
            }

            // Req body & UpdatedAt date/time
            const updatePostText = req.body.text;
            const updatedAt = Date.now();

            // Update post
            const postToUpdate = await Post.updateOne(
                {
                    _id: req.params.postId
                },
                {
                    $set: {
                        text: updatePostText,
                        updatedAt: updatedAt
                    }
                }
            );

            // Check and send
            if (postToUpdate)
                res.json({ Message: "Updated", postUpdated: req.body });
            else throw new ErrorHandlers.ErrorHandler(500, "Nothing to update");
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async delete(req, res) {
        try {
            // Match with username and pull to remove from Profile the ObjectId
            await Profile.findOneAndUpdate(
                { _id: res.id._id },
                { $pull: { posts: req.params.postId } },
                err => {
                    if (err) {
                        throw new ErrorHandlers.ErrorHandler(500, err);
                    }
                }
            );

            // Removing from Posts collection
            await Post.remove({ _id: req.params.postId }, err => {
                if (err) {
                    throw new ErrorHandlers.ErrorHandler(500, err);
                }
            });

            // Response
            res.json({ Message: "Deleted" });
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

module.exports = PostsController;
