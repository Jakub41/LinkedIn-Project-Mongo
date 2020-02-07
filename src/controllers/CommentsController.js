// Profile model
const { Profile, Post, Comment } = require("../models");
// Error handling
const { ErrorHandlers } = require("../utilities");

// Controller
const CommentsController = {
    // All comments
    async getAll(req, res) {
        try {
            // Finding all the Comments & count
            const comments = await Comment.find({});
            const commentsCount = await Comment.countDocuments();

            // Checking Comments from DB
            if (comments.length === 0) {
                throw new ErrorHandlers.ErrorHandler(
                    400,
                    "No comments were found"
                );
            }

            // response
            res.status(200).json({ count: commentsCount, comments });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Post All comments
    async getPostAllComments(req, res) {
        try {
            // Getting all
            const commentsFromPost = await Post.aggregate([
                {
                    // Find match by ID of the post
                    $match: {
                        _id: res.id._id
                    }
                },
                {
                    // left outer join
                    $lookup: {
                        from: "comments",
                        localField: "post",
                        foreignField: "_id",
                        as: "comments"
                    }
                },
                {
                    // Fields to show on response
                    $project: {
                        profile: 1,
                        comments: 1,
                        commentsCount: {
                            $size: "$comments"
                        },
                        _id: 0
                    }
                }
            ]);

            // Check and result
            if (commentsFromPost.length > 0) {
                res.json({
                    post: res.id._id,
                    commentsFromPost: commentsFromPost
                });
            } else {
                throw new ErrorHandlers.ErrorHandler(500, "No data");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Get one comment for post
    async getPostOneComment(req, res) {
        try {
            // Find the comment
            const comment = await Comment.findOne({
                post: res.id._id,
                _id: req.params.commentId
            });
            // Not comment error
            if (!comment) {
                throw new ErrorHandlers.ErrorHandler(404, "No comment");
            }
            // Response
            res.status(200).json({ postId: res.id._id, comment });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Create a new comment
    async createNew(req, res) {
        try {
            // Check for an empty body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to create");
            }

            // Check username exist
            const username = await Profile.findOne({
                username: req.body.username
            });

            if (!username) {
                throw new ErrorHandlers.ErrorHandler(
                    404,
                    "Username was not found"
                );
            }

            // Req param
            const postId = res.id._id;

            // Req body
            const newComment = req.body;

            // Creating the new Comment and updating the post ref
            const addNewComment = await Comment.create(newComment);

            // Updating Comment with post ID
            const updateIDPostComment = await Comment.findOneAndUpdate(
                { _id: addNewComment._id },
                { $set: { post: postId } }
            );

            // Error check
            if (updateIDPostComment.length === 0) {
                throw new ErrorHandlers.ErrorHandler(
                    500,
                    "Post ID cannot be saved"
                );
            }

            // Updating the Comment
            const updatePost = await Post.findOneAndUpdate(
                { _id: res.id._id },
                { $push: { comments: addNewComment._id } },
                { new: true }
            );

            // Error Check
            if (updateIDPostComment.length === 0 && updatePost.length === 0) {
                throw new ErrorHandlers.ErrorHandler(
                    500,
                    "Not possible to create a new post"
                );
            }

            // Response
            res.status(200).json({
                postId: postId,
                newComment: newComment
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Update comment
    async update(req, res) {
        try {
            // Check for an empty body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to create");
            }

            // Req body & UpdatedAt date/time
            const updateComment = req.body.comment;
            const updatedAt = Date.now();

            // Update comment
            const commentToUpdate = await Comment.updateOne(
                {
                    _id: req.params.commentId
                },
                {
                    $set: {
                        comment: updateComment,
                        updatedAt: updatedAt
                    }
                }
            );

            // Check and send
            if (commentToUpdate)
                res.json({ Message: "Updated", updatedComment: updateComment });
            else throw new ErrorHandlers.ErrorHandler(500, "Nothing to update");
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete comment
    async delete(req, res) {
        try {
            // Match with ID and pull to remove from post
            await Post.findOneAndUpdate(
                { _id: res.id._id },
                { $pull: { comments: req.params.commentId } }
            );

            // Removing from Posts collection
            await Comment.remove({ _id: req.params.commentId });

            // Response
            res.json({ Message: "Deleted" });
        } catch (error) {
            res.status(500).json(error);
        }
    }

};

module.exports = CommentsController;
