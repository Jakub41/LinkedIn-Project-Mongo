// Here defining profile model
// Embedded we have the Experience as []
const { Connect } = require("../db");
const { isEmail } = require("validator");

const postSchema = {
    type: Connect.Schema.Types.ObjectId,
    ref: "Post"
};

const experienceSchema = {
    role: {
        type: String,
        required: true
    },

    company: {
        type: String,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: false
    },

    description: {
        type: String,
        required: false
    },

    area: {
        type: String,
        required: true
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

    username: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false,
        default: "https://via.placeholder.com/150"
    }
};

const profileSchema = {
    firstname: {
        type: String,
        required: true
    },

    surname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [false, "Email is required"],
        validate: {
            validator: string => isEmail(string),
            message: "Provided email is invalid"
        }
    },

    bio: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    area: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: false,
        default: "https://via.placeholder.com/150"
    },

    username: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Connect.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    experience: [experienceSchema],
    posts: [postSchema],

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

const collectionName = "profile";
const profileSchemaModel = Connect.Schema(profileSchema);
const Profile = Connect.model(collectionName, profileSchemaModel);

module.exports = Profile;
