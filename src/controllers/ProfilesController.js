// Profile model
const { Profile } = require("../models");
// Error handling
const { ErrorHandlers, pdfMaker } = require("../utilities");

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

    // To GET a profile by id
    async getByUserId(req, res) {
        // Send back the profile corresponding on the id
        res.json(res.id);
    },

    // To GET a profile by username
    async getByUserName(req, res) {
        // Send back the profile corresponding on the username
        res.json(res.username);
    },

    // To GET by username and generates the CV-PDF of the profile
    async getCvPdf(req, res) {
        pdfMaker();
    },

    // To Create a new profile
    async createNew(req, res, next) {
        console.log(req.body);

        try {
            // Check empty req.body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to create");
            }

            // Profile init model
            const profile = new Profile({
                ...req.body
            });

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

    async uploadPicture(req, res) {
        try {
            // Check if any file is uploading
            if (!req.file) {
                throw new ErrorHandlers.ErrorHandler(
                    500,
                    "No picture to upload has been provided"
                );
            }
            // File provided transform to valid URL
            req.file =
                req.protocol +
                "://" +
                req.get("host") +
                "/images/" +
                req.file.filename;

            // Find Username and update the req.body fields
            const newProfileUrl = await Profile.findOneAndUpdate(
                { username: res.username.username },
                {
                    $set: { imageUrl: req.file }
                }
            );

            // Error check
            if (!newProfileUrl)
                throw new ErrorHandlers.ErrorHandler(500, "Upload failed");

            // Saving
            newProfileUrl.save();

            // Results sent it back
            res.json({
                username: res.username.username,
                message: "Image URL updated",
                imgUrl: req.file
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async update(req, res) {
        try {
            // Check for empty req.body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to update");
            } else {
                // Find id and update the fields
                const updatedProfile = await Profile.findByIdAndUpdate(
                    { _id: res.id._id },
                    { updatedAt: new Date() },
                    req.body,
                    (err, response) => {
                        return response;
                    }
                );

                // Error check
                if (!updatedProfile) {
                    throw new ErrorHandlers.ErrorHandler(400, "Update failed");
                }

                // Send result
                res.json(updatedProfile);
            }
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
