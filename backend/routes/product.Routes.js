import express from "express"
import { addProduct, deleteProducts, getAllProduct, updateProducts } from "../Controller/product.controller.js";
import { isAdmin, isAuthenticated } from "../Middleware/isAuthenticated.js";
import { multipleUpload } from "../Middleware/multer.js";
import { multerErrorHandler } from "../Middleware/multerErrorHandler.js";
const router = express.Router();

router.post("/add", isAuthenticated, isAdmin, multipleUpload, multerErrorHandler, addProduct);
router.get("/get-products", getAllProduct);
router.delete("/delete/:productId", isAuthenticated, isAdmin, deleteProducts);
router.put("/update/:productId", isAuthenticated, isAdmin, multipleUpload, updateProducts);

export default router;