import Cart from '../models/cartModel.js'
import { Product } from '../models/products.js'
import mongoose from "mongoose";



// get cart  controller 
export const getCart = async (req, res) => {
    try {

        const userId = req.id;


        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized User !"
            });
        }

        const cart = await Cart.findOne({ userId }).populate("items.productId");

        // If cart not found
        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: null,
                message: "Cart is empty"
            });
        }

        // If cart exists
        return res.status(200).json({
            success: true,
            cart
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



// add to cart controller
export const addToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, quantity } = req.body;

        // check product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found 😵!",
            });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [
                    {
                        productId, quantity: quantity, price: product.productPrice,
                    },
                ], totalprice: product.productPrice,
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({
                    productId,
                    quantity: quantity,
                    price: product.productPrice,
                });
            }
        }

        // ALWAYS recalculate total price
        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        );

        // save updated cart
        await cart.save();

        // populate product details
        const populatedCart = await Cart.findById(cart._id).populate("items.productId");

        return res.status(200).json({
            success: true,
            message: "Product Added To Cart Successfully ✅",
            cart: populatedCart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// update quantity cart  controller 
export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id
        const { productId, type } = req.body;


        if (!["increase", "decrease"].includes(type)) {
            return res.status(400).json({ message: "Invalid update type" });
        }


        let cart = await Cart.findOne({ userId })

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart Not Found !"
            })
        }

        const item = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ success: false, message: "Item Not Found !" })
        }

        if (type === "increase") {
            item.quantity += 1
        }

        if (type === "decrease") {
            if (item.quantity === 1) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity cannot be less than 1",
                });
            }
            item.quantity -= 1;
        }

        // recalculate total price
        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        );



        await cart.save()
        cart = await cart.populate("items.productId");

        return res.status(200).json({
            success: true,
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


// remove items controller 
export const removeFromCart = async (req, res) => {
    try {

        const userId = req.id;
        const { productId } = req.body;


        // ObjectId validation
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id",
            });
        }


        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart Not Found 😵"
            })
        }
        const initialLength = cart.items.length;

        cart.items = cart.items.filter(item => item.productId.toString() !== productId)

        if (cart.items.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Item Not Found in Cart",
                cart,
            });
        }

        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        )

        cart = await cart.populate("items.productId")

        cart.save()

        return res.status(200).json({

            success: true,
            message: "Item Deleted Successfully 😟",
            cart
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



