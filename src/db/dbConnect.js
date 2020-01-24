const config = require("../config/config");
const mongoose = require("mongoose");
// Defined in the ENV files and called from CONFIG file
const uri = config.db.url;
const port = config.db.port;
const name = config.db.name;

const baseUrl = uri + port + name;
console.log(baseDBUrl);

// To avoid deprecated messages
mongoose.connect(baseUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});

// Establish the connection
const db = mongoose.connection;

// Handling error DB
db.on("error", () => {
    console.log("> error occurred from the database");
    throw new Error("Something went wrong connecting to DB");
});

// Connected message
db.once("open", () => {
    console.log("> successfully opened the database");
});

module.exports = mongoose;
