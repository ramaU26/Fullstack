const cart = require("../models/cart.js");


const getProductscart = async(req, res) => {
    const Productscart = await cart.find({});

    if (Productscart) {
        res.json({ Productscart });
    } else {
        res.json({ mensaje: "no hay productos en el carrito" });
    }
};


module.exports = getProductscart;