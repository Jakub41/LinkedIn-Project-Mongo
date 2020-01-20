// Configuration file of the API using ENV
// Please configure the .env.example to .env with yours values
require("dotenv").config();

module.exports = {
    // Server setup
    server: {
        port: process.env.PORT,
        url: process.env.API_URL
    },
    // DB Setup
    db: {
        port: process.env.DB_PORT,
        url: process.env.DB_URL,
        name: process.env.DB_NAME
    }
};
