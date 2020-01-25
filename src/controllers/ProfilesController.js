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
            // Sending response with results
            res.status(200).json({ count: profilesCount, profiles });
            // Passing the error to the error-handling middleware in server.js
            next();
        } catch (err) {
            // Internal server error
            next(err);
        }
    },

    // To Create a new profile
    async createNew(req, res, next) {
        console.log(req.body);
        // Profile init
        const profile = new Profile({
            ...req.body
        });

        try {
            // Await the save
            const newProfile = await profile.save();
            // If save fail send error via handler
            if (!newProfile) {
                throw new ErrorHandlers.ErrorHandler(
                    400,
                    "Profile cannot be saved"
                );
            }

            // All OK send the response with results
            res.status(201).json({ message: "New profile added", newProfile });
            next();
        } catch (err) {
            // Errors
            next(err);
        }
    }
};

module.exports = ProfilesController;
