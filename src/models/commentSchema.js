const { Connect } = require("../db");

const commentSchema = {
    comment: {
        type: String,
        required: true
    },

    username: {
        type: Connect.Schema.Types.String,
        ref: "Profile",
        required: true
    },

    post: {
        type: Connect.Schema.Types.ObjectId,
        ref: "Post",
        required: false
    },

    createdAt: {
        type: Date,
        default: Date.now,
        required: false
    },

    updatedAt: {
        type: Date,
        default: Date.now,
        required: false
    }
};

const collectionName = "comment";
const commentSchemaModel = mongoose.Schema(commentSchema);
const Comment = mongoose.model(collectionName, commentSchemaModel);

module.exports = Comment;
