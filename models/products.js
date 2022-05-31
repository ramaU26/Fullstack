const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    img: { type: String, required: true, },
    inCart: { type: Boolean, required: false, },
    price: { type: Number, required: true, },
    stock: {type: Number, required: true},
});

module.exports = mongoose.model("products", ProductSchema, "Products");