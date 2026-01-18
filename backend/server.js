import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./datebase/db.js";
import userRoute from "./routes/user.Routes.js"
import productRoute from './routes/product.Routes.js'
import cartRoute from './routes/cart.Routes.js'
import orderRoute from './routes/order.Routes.js'
dotenv.config();

const app = express();
const Port = process.env.PORT || 8000;

// middleware 
app.use(express.json());   // for json formet accept 
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));    // allow frontend requests



app.use("/api/v1/user", userRoute);   //   route - http://localhost:8000/api/v1/user/
app.use("/api/v1/products", productRoute);   //   route - http://localhost:8000/api/v1/product/
app.use("/api/v1/cart", cartRoute);   //   route - http://localhost:8000/api/v1/cart/
app.use("/api/v1/orders", orderRoute);   //   route - http://localhost:8000/api/v1/orders/





app.listen(Port, () => {
    connectDB();
    console.log(`App is listening on port :${Port}`)
})
