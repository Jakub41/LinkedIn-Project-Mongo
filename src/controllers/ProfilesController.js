// Profile model
const { Profile } = require("../models");
const { ErrorHandlers } = require("../utilities");

// Profiles Controller
const ProfilesController = {
    // To GET ALL the profiles
    async getAll(req, res, next) {
        try {
            // Profiles from DB & count how many
            const profiles = await Profile.find({});
            const profilesCount = await Profile.countDocuments();

            // No profiles from DB then error via handler
            if (profiles.length === 0) {
                throw new ErrorHandlers.ErrorHandler(
                    404,
                    "No profiles have been found"
                );
            }

            res.status(200).json({ count: profilesCount, profiles });
            // Passing the error to the error-handling middleware in server.js
            next();
        } catch (err) {
            // Internal server error
            if (err) throw new ErrorHandlers.ErrorHandler(500, err);
            next(err);
        }
    },

    async create(req, res) {
        console.log(req.body);
        const newProfile = new Profile(req.body);
        await newProfile
            .save()
            .then(() =>
                res.json({
                    message: "New Profile added",
                    data: req.body
                })
            )
            .catch(err =>
                res.status(400).json({
                    Msg: "Creation of a new student failed",
                    Error: err
                })
            );
    }
};

module.exports = ProfilesController;
