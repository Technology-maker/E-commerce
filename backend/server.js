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

const allowedOrigins = process.env.CLIENT_URL?.split(",") || [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false); // DO NOT throw error
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);  // allow frontend requests

app.get('/', (req, res) => {
  res.send('Backend Was Running !')
})


app.use("/api/v1/user", userRoute);   //   route - http://localhost:8000/api/v1/user/
app.use("/api/v1/products", productRoute);   //   route - http://localhost:8000/api/v1/products/
app.use("/api/v1/cart", cartRoute);   //   route - http://localhost:8000/api/v1/cart/
app.use("/api/v1/orders", orderRoute);   //   route - http://localhost:8000/api/v1/orders/



connectDB();

app.listen(Port, () => {
    console.log(`App is listening on port :${Port}`)
})

// export for Vercel
export default app;