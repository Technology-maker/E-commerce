import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Separator } from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";



const Cart = () => {

    const cart = useSelector((store) => store.product.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const subTotal = cart?.totalPrice ?? 0;
    const shipping = subTotal > 199 ? 0 : 30;
    const tax = subTotal * 0.05;
    const total = subTotal + tax;


    const API = import.meta.env.VITE_API_BASE_URL;
    const accessToken = localStorage.getItem("accessToken");


    // quantity update function 
    const handelUpdateQuantity = async (productId, type) => {
        try {
            const res = await axios.put(`${API}/cart/update`, { productId, type }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }


            })
            if (res.data.success) {
                dispatch(setCart(res.data.cart))
                toast.success(
                    type === "increase" ? "Item Quantity Increased 😀" : "Item Quantity Decreased 😟"
                );

            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")

        }
    }



    // remove items function
    const handelRemove = async (productId) => {

        try {
            console.log("Removing productId 👉", productId);

            const res = await axios.delete(`${API}/cart/remove`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                data: { productId }
            })

            if (res.data.success) {
                dispatch(setCart(res.data.cart))
                toast.success("Product Removed From Cart 😟")
                console.log(res.data.cart);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went worng !")
        }
    }




    // load cart function 
    const loadCart = async () => {
        try {
            const res = await axios.get(`${API}/cart/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (res.data.success) {
                dispatch(setCart(res.data.cart))
            }

        } catch (error) {
            console.log(error);
            
        }
    }



    useEffect(() => {
        loadCart()
    }, [dispatch])


    return (
        <>
            <div className="py-20 bg-gray-50 min-h-screen">
                {cart?.items?.length > 0 ? (
                    <div className="max-w-7xl mx-auto px-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-7">
                            Shopping Cart
                        </h1>

                        {/* MAIN LAYOUT */}
                        <div className="flex flex-col lg:flex-row gap-7">

                            {/* CART ITEMS */}
                            <div className="flex flex-col gap-5 flex-1">
                                {cart.items.map((product) => (
                                    <Card key={product._id}>
                                        <div className="p-4 rounded-lg">

                                            {/* ITEM ROW */}
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">

                                                {/* IMAGE */}
                                                <img
                                                    src={product.productId?.productImg?.[0]?.url}
                                                    alt={product.productId?.productName}
                                                    className="w-20 h-20 object-cover rounded shrink-0"
                                                />

                                                {/* PRODUCT INFO */}
                                                <div className="flex-1 min-w-0 w-full">
                                                    <h2 className="font-semibold line-clamp-2">
                                                        {product.productId?.productName}
                                                    </h2>
                                                    <p className="text-gray-600 mt-1">
                                                        ₹{product.price}
                                                    </p>
                                                </div>

                                                {/* CONTROLS + PRICE (FIXED PART) */}
                                                <div className="flex flex-col md:flex-row items-start md:items-center md:justify-end gap-3 w-full md:w-auto">

                                                    {/* ROW 1: QUANTITY */}
                                                    <div className="flex items-center gap-3">
                                                        <Button onClick={() => { handelUpdateQuantity(product.productId._id, "decrease") }} variant="outline" className='cursor-pointer' size="icon">-</Button>
                                                        <span className="w-6 text-center font-medium">
                                                            {product.quantity}
                                                        </span>
                                                        <Button onClick={() => { handelUpdateQuantity(product.productId._id, "increase") }} variant="outline" className='cursor-pointer' size="icon">+</Button>
                                                    </div>

                                                    {/* ROW 2: PRICE + REMOVE */}
                                                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                                                        <p className="font-semibold">
                                                            ₹{product.productId?.productPrice * product.quantity}
                                                        </p>

                                                        <Button
                                                            variant="ghost"
                                                            onClick={() =>
                                                                handelRemove(typeof product.productId === "object" ? product.productId._id : product.productId)
                                                            }
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* ORDER SUMMARY */}
                            <Card className="w-full lg:w-[400px] h-fit">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({cart.items.length})</span>
                                        <span>₹{subTotal.toLocaleString("en-IN")}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>₹{shipping}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Tax (5%)</span>
                                        <span>₹{tax.toLocaleString("en-IN")}</span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{total.toLocaleString("en-IN")}</span>
                                    </div>

                                    <div className="space-y-3 pt-4">
                                        <div className="flex gap-2">
                                            <Input placeholder="Promo Code" />
                                            <Button className='cursor-pointer' variant="outline">Apply</Button>
                                        </div>
                                        <Button onClick={() => navigate('/address')} className="w-full bg-pink-600 cursor-pointer">
                                            PLACE ORDER
                                        </Button>

                                        <Link to="/products" >
                                            <Button variant="outline" className="w-full bg-transparent cursor-pointer ">
                                                Continue Shoping
                                            </Button>
                                        </Link>

                                    </div>
                                    <div className="pt-4 space-y-2">
                                        {/* Shipping + Return */}
                                        <p className="inline-flex items-center gap-2 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                            🚚 FREE shipping on orders above ₹199 • 🔄 7-day easy returns
                                        </p>

                                        {/* Secure Checkout */}
                                        <p className="inline-flex items-center gap-2 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                            🔒 100% secure checkout protected by SSL encryption
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center bg-gray-50/50">
                        <div className="bg-gray-100 p-6 rounded-full">
                            <ShoppingCart className="w-20 h-20 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
                        <p className="text-muted-foreground text-center max-w-sm">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link to="/products">
                            <Button className="mt-4 bg-pink-600 hover:bg-pink-700">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
            
        </>
    );
};

export default Cart;
