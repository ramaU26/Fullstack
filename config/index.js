require("dotenv").config();

let config = {
    port: process.env.PORT,
    SECRET_KEY_SESSION: process.env.SECRET_KEY_SESSION
}

module.exports = { config } ;