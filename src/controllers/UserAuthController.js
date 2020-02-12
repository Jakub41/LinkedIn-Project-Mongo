// Env
const { Config } = require("../config");
// Error
const { ErrorHandlers } = require("../utilities");
// User model
const { User } = require("../models");
// JWT Auth
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        const accessToken = jwt.sign(
            { userId: newUser._id },
            Config.jwt.secret,
            {
                expiresIn: "1d"
            }
        );

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
        const accessToken = jwt.sign(
            { userId: user._id },
            Config.jwt.secret,
            {
                expiresIn: "1d"
            }
        );

        // Find user with token
        await User.findByIdAndUpdate(user._id, { accessToken });

        // Not user
        if (!User)
            return next(
                new ErrorHandlers.ErrorHandler(401, "User not found")
            );
        // Response
        res.status(200).json({
            message: "Logged in",
            data: { email: user.email, role: user.role },
            accessToken,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { signup, login };
