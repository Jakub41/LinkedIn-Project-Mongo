// Models
const { Profile } = require("../models");
// Error handling
const { ErrorHandlers } = require("../utilities");

const SearchController = {
    async getQuery(req, res) {
        try {
            const { fn, ln, cp } = req.query;

            const query = {
                $or: []
            };

            if (fn) query.$or.push({ firstname: fn });
            if (ln) query.$or.push({ surname: ln });
            if (cp) query.$or.push({ "experience.company": cp });

            const searchResult = Profile.find(query, docs => {
                return docs
            });

            if ((await searchResult).length === 0)
                throw new ErrorHandlers.ErrorHandler(
                    404,
                    "Query do not provided any result"
                );
            res.status(200).json(searchResult);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = SearchController;
