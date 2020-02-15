// Models
const { Profile } = require("../models");
// Error handling
const { ErrorHandlers } = require("../utilities");

const SearchController = {
    async getQuery(req, res) {
        try {
            const set = {};

            if (req.query.fn) {
                set["firstname"] = req.query.fn;
            }
            if (req.query.ln) {
                set["surname"] = req.query.ln;
            }
            if (req.query.cp) {
                set["experience.company"] = req.query.cp;
            }

            if (Object.keys(set).length != 0) {
                const searchResult = await Profile.find(set, (err, doc) => {
                    return doc;
                });
                if ((await searchResult).length === 0)
                    throw new ErrorHandlers.ErrorHandler(
                        404,
                        "Query do not provided any result"
                    );
                res.status(200).json(searchResult);
            } else {
                throw new ErrorHandlers.ErrorHandler(
                    404,
                    "Query do not provided any result"
                );
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = SearchController;
