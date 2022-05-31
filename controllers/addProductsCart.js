const Cart = require("../models/cart");
const Product = require("../models/products.js");

const addProductCart = async(req, res) => {
    const { name, img, price, } = req.body;

    const estaEnProducts = await Product.findOne({ name });

    const noEstaVacio = name !== "" && img !== "" && price !== "";

    const estaEnElCarrito = await Cart.findOne({ name });

    if (!estaEnProducts) {
        res.status(400).json({
            mensaje: "Este producto no se encuentra en nuestra base de datos",
        });

    } else if (noEstaVacio && !estaEnElCarrito) {
        const newProductInCart = new Cart({ name, img, price, amount: 1 });

        await Product.findByIdAndUpdate(
                estaEnProducts?._id,
                 { inCart: true, name, img, price }, 
                 { new: true }
            )
            .then((product) => {
                newProductInCart.save();
                res.json({
                    mensaje: `El producto fue agregado al carrito`,
                    product,
                });
            })
            .catch((error) => console.error(error));

    } else if (estaEnElCarrito) {
        res.status(400).json({
            mensaje: "El producto ya esta en el carrito",
        });
    }
};

module.exports = addProductCart;