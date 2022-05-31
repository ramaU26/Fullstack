const mongoose = require("mongoose");

const MONGO_URL = "mongodb://localhost/productosCarrito";

const db = async() => {
    await mongoose
        .connect(MONGO_URL)
        .then(() => console.log("DB Funcionando"))
        .catch((error) => console.error(error));
};

module.exports = db