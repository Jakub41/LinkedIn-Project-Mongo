const serverStatus = (req, res) => {
    res.status(200).send({
        route: req.originalUrl,
        message: "The API is up and running",
        info: "The endpoint may be not valid or you are in the Root"
    });
};

module.exports = serverStatus;
