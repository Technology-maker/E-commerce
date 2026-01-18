import express from "express"
import { isAdmin, isAuthenticated } from '../Middleware/isAuthenticated.js'
import { createOrder, getAllOrdersAdmin, getMyOrder, getSalse, getUserOrders, verifyPayment } from "../Controller/order.Controller.js"

const Router = express.Router()

Router.post("/create-order", isAuthenticated, createOrder);
Router.post("/verify-payment", isAuthenticated, verifyPayment);
Router.get("/myorder", isAuthenticated, getMyOrder);
Router.get("/user-orders/:userId", isAuthenticated, isAdmin, getUserOrders);
Router.get("/all-orders", isAuthenticated, isAdmin, getAllOrdersAdmin);
Router.get("/sales", isAuthenticated, isAdmin, getSalse);


export default Router