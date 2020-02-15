// Models
const { Profile } = require("../models");
// Error handling
const { ErrorHandlers } = require("../utilities");

const SearchController = {
    async getQuery(req, res) {
        try {
            // Set
            const set = {};

            // query params
            const { fn, ln, cp } = req.query;

            // RexExp to allow upper and lower case in the search
            // First name
            if (fn) {
                set["firstname"] = new RegExp(
                    "\\b" + req.query.fn + "\\b",
                    "i"
                );
            }

            // Last name
            if (ln) {
                set["surname"] = new RegExp("\\b" + req.query.ln + "\\b", "i");
            }

            // Company
            if (cp) {
                set["experience.company"] = new RegExp(
                    "\\b" + req.query.cp + "\\b",
                    "i"
                );
            }

            //
            if (Object.keys(set).length != 0) {
                // Searching the profile results
                const searchResult = await Profile.find(set, (err, doc) => {
                    return doc;
                });

                // No results
                if ((await searchResult).length === 0)
                    throw new ErrorHandlers.ErrorHandler(
                        404,
                        `Query do not provided any result`
                    );

                // Response
                res.status(200).json(searchResult);
            } else {
                // No result
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
