const { Connect } = require("../db");

const reactionSchema = {
    likedBy: {
        type: String,
        unique: true,
        sparse: true
    }
};

const postSchema = {
    text: {
        type: String,
        required: true,
        unique: true,
        sparse: false
    },

    username: {
        type: Connect.Schema.Types.String,
        ref: "Profile",
        required: true
    },

    image: {
        type: String,
        default: "https://via.placeholder.com/150",
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
    },

    reactions: [reactionSchema],

    comments: {
        type: Connect.Schema.Types.ObjectId,
        ref: "Comment",
        required: false
    }
};

const collectionName = "post";
const postSchemaModel = Connect.Schema(postSchema);
const Post = Connect.model(collectionName, postSchemaModel);

module.exports = Post;
