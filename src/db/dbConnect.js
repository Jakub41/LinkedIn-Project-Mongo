const { Config } = require("../config");
const mongoose = require("mongoose");
// Defined in the ENV files and called from CONFIG file
const uri = Config.db.url;
const port = Config.db.port;
const name = Config.db.name;

const baseUrl = uri + port + name;

// To avoid deprecated messages
mongoose.connect(baseUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// Establish the connection
const db = mongoose.connection;

// Handling error DB
db.on("error", (err) => {
    console.log("> Error occurred from the database");
    throw new Error("Something went wrong connecting to DB", err);
});

// Connected message
db.once("open", () => {
    console.log("> Successfully opened the database");
    console.log(">", baseUrl);
});

module.exports = mongoose;
