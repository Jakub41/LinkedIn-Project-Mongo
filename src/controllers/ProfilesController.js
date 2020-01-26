// Profile model
const { Profile } = require("../models");
// Error handling
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
        } catch (err) {
            // Internal server error
            res.status(500).json(err);
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
            // next();
        } catch (err) {
            // Errors
            res.status(500).json(err);
        }
    },

    async getByUserId(req, res) {
        // Send back the profile corresponding on the id
        res.json(res.id);
    },

    async getByUserName(req, res) {
        // Send back the profile corresponding on the username
        res.json(res.username);
    },

    async update(req, res) {
        // Need to be written better this part for check the req.body fields
        if (req.body.firstname) {
            res.id.firstname = req.body.firstname;
        }

        if (req.body.surname) {
            res.id.surname = req.body.surname;
        }

        if (req.body.email) {
            res.id.email = req.body.email;
        }

        if (req.body.bio) {
            res.id.bio = req.body.bio;
        }

        if (req.body.title) {
            res.id.title = req.body.title;
        }

        if (req.body.area) {
            res.id.area = req.body.area;
        }

        if (req.body.username) {
            res.id.username = req.body.username;
        }

        // Updating with the new date time
        if (req.body) {
            res.id.updatedAt = new Date();
        }

        try {
            // Saving the changes to update
            const updatedProfile = await res.id.save();

            // Error check
            if (!updatedProfile) {
                throw new ErrorHandlers.ErrorHandler(400, "Update failed");
            }

            // Send result
            res.json(updatedProfile);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async delete(req, res) {
        try {
            // Removing the profile by ID
            await res.id.remove();
            // Message back
            res.json({ message: "Deleted This profile" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = ProfilesController;
