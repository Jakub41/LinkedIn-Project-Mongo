// Profile model
const { Profile } = require("../models");
// Error handling
const { ErrorHandlers } = require("../utilities");
// MongoDB
const { ObjectID } = require("mongodb");

const ExperiencesController = {
    async getAll(req, res) {
        try {
            const profileWithExperiences = await Profile.aggregate([
                { $match: { username: res.username.username } },
                {
                    $addFields: {
                        experiences_count: {
                            $size: "$experience"
                        }
                    }
                },
                {
                    $project: {
                        experiences_count: 1,
                        username: 1,
                        experience: 1,
                        _id: 0
                    }
                }
            ]);

            if (profileWithExperiences.length > 0) {
                res.send({ profileExperiences: profileWithExperiences });
                //you can also return like this
                //res.send({ profileExperiences: profileWithExperiences[0] });
            } else {
                throw new ErrorHandlers.ErrorHandler(500, "No data");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getById(req, res) {
        try {
            const profileWithExperiences = await Profile.aggregate([
                { $match: { username: res.username.username } },
                {
                    $unwind: "$experience"
                },

                {
                    $match: {
                        "experience._id": new ObjectID(req.params.experienceId)
                    }
                },

                {
                    $project: {
                        username: 1,
                        experience: 1,
                        _id: 0
                    }
                }
            ]);

            if (profileWithExperiences.length > 0) {
                res.status(200).json({
                    profileExperience: profileWithExperiences
                });
            } else {
                throw new ErrorHandlers.ErrorHandler(500, "No data");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Get one
    async getOneExp(req, res) {
        try {
            const experience = await Profile.findOne({
                _id: res.id._id,
                experience: { _id: req.params.experienceId }
            });

            if (experience.length === 0) {
                throw new ErrorHandlers.ErrorHandler(404, "No experience");
            }
            res.status(200).json({ profileId: res.id._id, experience });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createNew(req, res) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to create");
            }

            const newExperience = req.body;

            const addNewExperience = await Profile.findOneAndUpdate(
                { username: res.username.username },
                { $push: { experience: newExperience } }
            );

            if (addNewExperience) {
                res.status(200).json({
                    userName: res.username.username,
                    newExperience: newExperience
                });
            } else {
                // Error
                throw new ErrorHandlers.ErrorHandler(500, "Post failed");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async update(req, res) {
        try {
            // Check for empty req.body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to update");
            }

            // Req.body
            const updateExperience = req.body;

            // Set empty OBJ
            const set = {};

            // Loop the fields to update
            for (const field in updateExperience) {
                set["experience.$." + field] = updateExperience[field];
            }

            // Update the updatedAt as nested element
            set["experience.$.updatedAt"] = Date.now();

            // Update experience on that username
            const experienceToUpdate = await Profile.updateOne(
                {
                    username: res.username.username,
                    "experience._id": req.params.experienceId
                },
                { $set: set }
            );

            // Check and send
            if (experienceToUpdate)
                res.json({ Message: "Updated", experienceUpdated: req.body });
            else throw new ErrorHandlers.ErrorHandler(500, "Nothing to update");
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Delete
    async delete(req, res) {
        try {
            // Match with username and pull to remove the experience
            await Profile.findOneAndUpdate(
                { username: res.username.username },
                { $pull: { experience: { _id: req.params.experienceId } } },
                err => {
                    if (err) {
                        throw new ErrorHandlers.ErrorHandler(500, err);
                    }
                    res.json({ Message: "Deleted" });
                }
            );
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

module.exports = ExperiencesController;
