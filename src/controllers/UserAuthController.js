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
        if (!email || !password) {
            return next(
                new ErrorHandlers.ErrorHandler(
                    401,
                    `Please fill the required detail`
                )
            );
        }
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
            username: email,
            role: role || "basic"
        });

        // Assign token
        // We need private secret key in the ENV
        // to compare auth

        // New user save
        await newUser.save();
        // Response
        const accessToken = Token.getToken({ userId: newUser._id });
        res.json({
            user: {
                email: newUser.email,
                role: newUser.role,
                _id: newUser._id
            },
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
        const user = await User.findOne({ email }).populate("profile");

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

        //prepare user for resposnse
        const resUser = prepareUserForResponse(user);

        // Response
        res.status(200).json({
            message: "Logged in",
            user: resUser,
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

        // Check presence of passwords
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
        const user = await User.findById(req.user._id);
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
        //new password hashed
        const hashedPassword = await hashPassword(newPassword);

        // User Update
        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            passwordCreatedAt: Date.now()
        });
        // Not user
        if (!User)
            return next(new ErrorHandlers.ErrorHandler(401, "User not found"));
        // Response
        const accessToken = Token.getToken({ userId: user._id });

        res.status(200).json({
            message: "Password Changed successfully",
            accessToken
        });
    } catch (err) {
        next(err);
    }
};

// Facebook login
const fbLogin = async (req, res, next) => {
    try {
        const { id, email, accessToken } = req.body;
        //find one by email
        const user = await User.findOne({ email });

        if (user) {
            //update the user with facebook key
            const upDateUser = await User.findByIdAndUpdate(
                user._id,
                { facebookId: id },
                { new: true }
            ).populate("profile");
            const token = Token.getToken({ userId: upDateUser._id });
            const resUser = prepareUserForResponse(upDateUser);
            return res.json({
                user: resUser,
                accessToken: token
            });
        }
        // because password is required to create the user so we create fake password
        const fakePassword = accessToken;
        const newUser = new User({
            email,
            username: email,
            password: fakePassword,
            facebookId: id
        });
        await newUser.save();

        const token = Token.getToken({ userId: newUser._id });
        const resUser = prepareUserForResponse(newUser);
        res.json({
            user: resUser,
            accessToken: token
        });
    } catch (err) {
        next(err);
    }
};

//load user with token user
const loadUserWithToken = (req, res, next) => {
    const user = req.user;

    const token = Token.getToken({ userId: user._id });
    //prepare responded users
    const resUser = prepareUserForResponse(user);
    res.json({
        user: resUser,
        accessToken: token
    });
};

const prepareUserForResponse = user => {
    let resUser = { email: user.email, _id: user._id, role: user.role };
    if (user.profile) {
        resUser.profile = user.profile;
    }
    return resUser;
};

module.exports = { signup, login, passwordReset, fbLogin, loadUserWithToken };
