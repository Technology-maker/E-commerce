import razorPayInstance from "../config/razorPay.js";
import Cart from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";
import crypto from 'crypto'
import { User } from "../models/userModel.js";
import { Product } from "../models/products.js";
import { format } from "path";
import { log } from "console";


// Create order controleler 
export const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency } = req.body;

        const options = {
            amount: Math.round(Number(amount) * 100), // paise
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorPayInstance.orders.create(options);

        // const save order in db  
        const newOrder = new Order({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency,
            status: "Pending",
            razorpayOrderId: razorpayOrder.id
        })



        await newOrder.save();

        res.status(200).json({
            success: true,
            order: razorpayOrder,
        });
    } catch (error) {
        console.log("❌ Error In create order ", error);
        res.status(500).json({
            success: false, message: error.message
        });
    }
};




// varify payment order Controller 

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body;
        const userId = req.user._id





        if (paymentFailed) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }

            )
            return res.status(400).json({
                success: false,
                message: "Paypament Failed",
                order
            });
        }


        if (!razorpay_payment_id || !razorpay_signature) {
            return res.json({
                success: false,
                message: "Incomplete payment data"
            });
        }


        const sign = razorpay_order_id + "|" + razorpay_payment_id;


        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {

            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: "Paid",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature

                },

                { new: true }

            )

            if (!order) {
                return res.status(200).json({
                    success: false,
                    message: "Order not found",
                });
            }

            await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [], totalPrice: 0 } })

            return res.json({
                success: true,
                message: "Payment Successfull 😊",
            });
        }
        else {
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }

            );
            return res.status(400).json({
                success: false,
                message: "Payment Not Verified ! or Invalid signature"

            })
        }



    } catch (error) {
        console.log("❌ Error In Verufy Payment: ", error);
        res.status(500).json({
            success: false, message: error.message
        });
    }
}




// get my orders controller
export const getMyOrder = async (req, res) => {
    try {
        const userId = req.user._id; // from isAuthenticated middleware

        const orders = await Order.find({ user: userId })
            .populate({
                path: "products.productId",
                select: "productName productPrice productImg"
            })
            .populate({
                path: "user",
                select: "firstName lastName email"
            })
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        console.log("❌ Error Fetching User Orders:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};





// get all User orders  (admin only)
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params // user id come from url 

        const orders = await Order.find({ user: userId })
            .populate({
                path: "products.productId",
                select: "productName  productPrice productImg"
            })  // fetch product details 
            .populate("user", "firstName lastName email")  // fetch user info


        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
            message: "Orders Fetch Successfully !"
        })

    } catch (error) {
        console.log("❌ Error Fetching User Orders in Admin :", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}




// get all orders from all users (admin only)
export const getAllOrdersAdmin = async (req, res) => {
    try {

        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "firstName lastName email") //populate user info 
            .populate("products.productId", "productName productPrice")// populate product info 

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
            message: "All Products Fetch Successfully👍",

        });


    } catch (error) {
        console.log("❌ Error Fetching All Users Orders in Admin :", error);
        res.status(500).json({
            success: false,
            message: error.message,

        });
    }
}




// get salse controller
export const getSalse = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments({})
        const totalProducts = await Product.countDocuments({})
        const totalOrders = await Order.countDocuments({ status: "Paid" })


        // Total salse amount  

        const totalSalseAgg = await Order.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])


        const totalSales = totalSalseAgg[0]?.total || 0;

        //salse group by date(last 30  days )

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const slaseByDate = await Order.aggregate([
            {
                $match: { status: "Paid", createdAt: { $gte: thirtyDaysAgo } }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    amount: { $sum: "$amount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])

        console.log(slaseByDate);



        const formattedSalse = slaseByDate.map((item) => ({
            date: item._id,
            amount: item.amount,
            orders: item.orders,
        }))




        return res.status(200).json({
            success: true,
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales,
            salesByDate: formattedSalse,
            message: "Sales data fetched"
        });




    } catch (error) {
        console.log("❌ Error fetching in Salse Data - :", error);
        res.status(500).json({
            success: false,
            message: error.message,

        });
    }
}

