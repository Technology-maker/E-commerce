import express from "express"
import { allUsers, changePassword, forgotPassword, getUserById, Login, Logout, Register, reVerify, Verify, verifyOTP, updateUser, userSupport } from "../Controller/user.controller.js"
import { isAdmin, isAuthenticated } from "../Middleware/isAuthenticated.js";
import { singleUpload } from "../Middleware/multer.js";
import { multerErrorHandler } from "../Middleware/multerErrorHandler.js";

const router = express.Router();

router.post("/register", Register);
router.post("/verify", Verify);
router.post("/reverify", reVerify);
router.post("/login", Login);
router.post("/logout", isAuthenticated, Logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email", changePassword);
router.get("/all-users", isAuthenticated, isAdmin, allUsers);
router.get("/get-users/:userId", getUserById);
router.put("/update/:id", isAuthenticated, singleUpload, multerErrorHandler, updateUser)
router.post("/support", userSupport)
 

export default router;