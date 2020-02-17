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
                    "\\b.*" + req.query.fn + ".*\\b",
                    "i"
                );
            }

            // Last name
            if (ln) {
                set["surname"] = new RegExp(
                    "\\b.*" + req.query.ln + ".*\\b",
                    "i"
                );
            }

            // Company
            if (cp) {
                set["experience.company"] = new RegExp(
                    "\\b.*" + req.query.cp + ".*\\b",
                    "i"
                );
            }

            let searchResult = "";

            if (Object.keys(set).length != 0) {
                // Limit & sort results
                if (req.query.limit || req.query.sort) {
                    // Descendant
                    if (req.query.sort === "dsc") {
                        const limit = parseInt(req.query.limit);
                        searchResult = await Profile.find(set, (err, doc) => {
                            return doc;
                        })
                            .limit(limit)
                            .sort({ _id: -1 });
                        // Ascendant
                    } else if (req.query.sort === "asc") {
                        const limit = parseInt(req.query.limit);
                        searchResult = await Profile.find(set, (err, doc) => {
                            return doc;
                        })
                            .limit(limit)
                            .sort({ _id: 1 });
                    } else {
                        // Limit of result
                        const limit = parseInt(req.query.limit);
                        searchResult = await Profile.find(set, (err, doc) => {
                            return doc;
                        })
                            .limit(limit)
                            .sort({ _id: 1 });
                    }
                } else {
                    // Results without sort & limit
                    searchResult = await Profile.find(set, (err, doc) => {
                        return doc;
                    });
                }
                // No results
                if ((await searchResult).length === 0)
                    throw new ErrorHandlers.ErrorHandler(
                        404,
                        "Query do not provided any result"
                    );
                // Results
                res.status(200).json({
                    count: searchResult.length,
                    data: searchResult
                });
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
