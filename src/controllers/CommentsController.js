// Profile model
const { Post, Comment } = require("../models");
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

    // Get pne comment for post
    async getProfileOneComment(req, res) {
        try {
            const comment = await Comment.findOne({
                post: res.id._id,
                _id: req.params.commentId
            });

            if (comment.length === 0) {
                throw new ErrorHandlers.ErrorHandler(404, "No comment");
            }
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
    }
};

module.exports = CommentsController;
