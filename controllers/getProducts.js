const Product = require("../models/products.js");

const getProducts = async(req, res) => {
    const products = await Product.find({});

    console.log(products)
    if (products) {
        res.json({ products });
    } else {
        res.json({ mensaje: "No hay productos" });
    }
};

module.exports = getProducts;