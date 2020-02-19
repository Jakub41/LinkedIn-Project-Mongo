const { Connect } = require("../db");
const { isEmail } = require("validator");
const passportLocalMongoose = require("passport-local-mongoose");
const crpto = require("crypto");
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
        required: true,
    },

    passwordCreatedAt: {
        type: Date,
        default: Date.now,
    },

    role: {
        type: String,
        default: "basic",
        enum: ["basic", "moderator", "admin"]
    },
    profile: {
        type: Connect.Schema.Types.ObjectId,
        ref: "Profile"
    },

    facebookId: String,
    refreshToken: String
});

// Password expiration check
UserSchema.methods.checkPasswordDate = function(jwtTime) {

    if (this.passwordCreatedAt) {
        const changePassword = parseInt(
            this.passwordCreatedAt.getTime() / 1000,
            10
        );
        return jwtTime < changePassword;
    }
    return false;
};


UserSchema.plugin(passportLocalMongoose);

const User = Connect.model("User", UserSchema);

module.exports = User;
