import express from "express"
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import { addToCart, getCart, removeFromCart, updateQuantity } from "../Controller/cart.Controller.js";
const router = express.Router();

router.get("/", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.put("/update", isAuthenticated, updateQuantity);
router.delete("/remove", isAuthenticated, removeFromCart);

export default router;