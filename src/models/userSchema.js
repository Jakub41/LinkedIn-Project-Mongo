const { Connect } = require("../db");
const { isEmail } = require("validator");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = Connect.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Email is required"],
        validate: {
            validator: string => isEmail(string),
            message: "Provided email is invalid"
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "basic",
        enum: ["basic", "moderator", "admin"]
    },
    accessToken: {
        type: String
    },

    profile: {
        type: Connect.Schema.Types.ObjectId,
        ref: "Profile"
    },

    facebookId: String,
    refreshToken: String
});

UserSchema.plugin(passportLocalMongoose);

const User = Connect.model("user", UserSchema);

module.exports = User;
