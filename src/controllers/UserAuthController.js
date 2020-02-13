// Error
const { ErrorHandlers } = require("../utilities");
// User model
const { User } = require("../models");
// Bcrypt
const bcrypt = require("bcrypt");
// Helper
const { Token } = require("../helpers");
// Middleware
const { isValidPsw } = require("../middlewares");

// Hashing the password on register new user
// 10 =>  2^10 key expansion rounds
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// Validate password with hashed password on login
async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

// SignUp user
const signup = async (req, res, next) => {
    try {
        // Body
        const { email, password, role } = req.body;

        // Validate the password format
        if (!isValidPsw(password))
            return next(
                new ErrorHandlers.ErrorHandler(
                    401,
                    `Password >${password}< is not in the right format: at least 8 chars long but max 64; min 1 uppercase; min 1 lowercase; min 1 digits; min 1 symbol; no whitespace`
                )
            );

        // Password hashed
        const hashedPassword = await hashPassword(password);

        // Creating the new user
        // If not role by default is basic
        // roles => admin, moderator and basic
        const newUser = new User({
            email,
            password: hashedPassword,
            role: role || "basic"
        });

        // Assign token
        // We need private secret key in the ENV
        // to compare auth
        const accessToken = Token.getToken({ userId: newUser._id });

        // New user token
        newUser.accessToken = accessToken;

        // New user save
        await newUser.save();

        // Response
        res.json({
            data: newUser,
            accessToken,
            message: "User created successfully"
        });
    } catch (err) {
        next(err);
    }
};

// Login user
const login = async (req, res, next) => {
    try {
        // User credentials body
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // Check error user exist
        if (!user)
            return next(
                new ErrorHandlers.ErrorHandler(401, "Email does not exist")
            );

        // Validate the password
        const validPassword = await validatePassword(password, user.password);

        // Validation fail
        if (!validPassword)
            return next(
                new ErrorHandlers.ErrorHandler(401, "Password is not correct")
            );

        // User token auth
        const accessToken = Token.getToken({ userId: user._id });

        // Find user with token
        await User.findByIdAndUpdate(user._id, { accessToken });

        // Not user
        if (!User)
            return next(new ErrorHandlers.ErrorHandler(401, "User not found"));
        // Response
        res.status(200).json({
            message: "Logged in",
            data: { email: user.email, role: user.role },
            accessToken
        });
    } catch (err) {
        next(err);
    }
};

// Reset password
const passwordReset = async (req, res, next) => {
    try {
        // User credentials body
        const { oldPassword, newPassword } = req.body;

        if (!newPassword || !oldPassword) {
            return next(new ErrorHandlers.ErrorHandler(401, "Api Bad use"));
        }

        // Validate the password format
        if (!isValidPsw(newPassword))
            return next(
                new ErrorHandlers.ErrorHandler(
                    401,
                    `Password >${newPassword}< is not in the right format: at least 8 chars long but max 64; min 1 uppercase; min 1 lowercase; min 1 digits; min 1 symbol; no whitespace`
                )
            );
        // Find the user by email
        const user = await User.findOne({
            accessToken: res.locals.loggedInUser.accessToken
        });
        // Check error user exist
        if (!user)
            return next(
                new ErrorHandlers.ErrorHandler(
                    401,
                    "accessToken is Expired or not Valid"
                )
            );

        // Validate the old password
        const validPassword = await validatePassword(
            oldPassword,
            user.password
        );

        // Validation fail old password
        if (!validPassword)
            return next(
                new ErrorHandlers.ErrorHandler(
                    401,
                    "Old Password is not correct"
                )
            );

        // User access token update auth
        const accessToken = Token.getToken({ userId: user._id });
        //new password hashed
        const hashedPassword = await hashPassword(newPassword);

        // User Update
        await User.findByIdAndUpdate(user._id, {
            accessToken,
            password: hashedPassword
        });
        // Not user
        if (!User)
            return next(new ErrorHandlers.ErrorHandler(401, "User not found"));
        // Response
        res.status(200).json({
            message: "Password Changed successfully",
            data: { email: user.email, role: user.role },
            accessToken
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { signup, login, passwordReset };
