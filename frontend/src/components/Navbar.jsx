import React, { useState } from "react"

import { Link, useNavigate, } from "react-router-dom"
import { ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "./ui/button"
import axios from "axios"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "@/redux/userSlice"
import { setCart } from "@/redux/productSlice"



const Navbar = () => {
    const user = useSelector(state => state.user.user)
    const accessToken = localStorage.getItem('accessToken')
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const cart = useSelector(store => store.product.cart);

    const admin = user?.role === "admin";


    const logoutHandler = async () => {

        if (!accessToken) {
            dispatch(setUser(null), setCart(null))
            return
        }

        try {

            // calling api
            const API = import.meta.env.VITE_API_BASE_URL;
            const res = await axios.post(`${API}/user/logout`, {},
                {
                    // passing Barer token 
                    headers: { Authorization: `Bearer ${accessToken}` }
                })


            // id data success 
            if (res.data.success) {
                dispatch(setUser(null))
                dispatch(setCart(null))

                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                toast.success(res.data.message)
            }

            // if any error  
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Logout failed")
        }
    }


    return (
        <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">

                {/* Logo */}
                <h1 className="font-bold text-2xl text-pink-600">E-commerce</h1>

                {/* Desktop Nav */}
                <nav className="hidden sm:flex items-center gap-6 text-lg font-semibold">
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/contact">ContactUs</Link>


                    {user && <Link to={`/profile/${user._id}`} >Hello, {user.firstName}!</Link>}

                    {
                        admin && <Link to={`/dashboard/salse`} >Dashboard</Link>
                    }

                    <Link to="/cart" className="relative flex items-center">
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5">
                            {cart?.items?.length ?? 0}
                        </span>
                    </Link>

                    {user ? (
                        <Button onClick={logoutHandler} className="bg-pink-600 text-white">Logout</Button>
                    ) : (
                        <Button onClick={() => navigate("/login")} className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white">
                            Login
                        </Button>
                    )}
                </nav>

                {/* Mobile Icons */}
                <div className="flex items-center gap-4 sm:hidden">
                    <Link to="/cart" className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5">
                            {cart?.items?.length ?? 0}
                        </span>
                    </Link>

                    <button onClick={() => setOpen(!open)}>
                        {open ? <X className="w-6 h-6 cursor-pointer" /> : <Menu className="w-6 h-6 cursor-pointer" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className=" flex sm:hidden bg-pink-50 border-t border-pink-200 justify-center">
                    <ul className="flex flex-col gap-4 px-4 py-4 text-lg font-semibold items-center text-center w-full">
                        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                        <Link to="/products" onClick={() => setOpen(false)}>Products</Link>
                        <Link to="/contact" onClick={() => setOpen(false)}>ContactUs</Link>

                        {user && (
                            <Link to={`/profile/${user._id}`} onClick={() => setOpen(false)}>
                                Hello {user.firstName}
                            </Link>
                        )}

                        {
                            admin && <Link to={`/dashboard/salse`} >Dashboard</Link>
                        }

                        {user ? (
                            <Button onClick={logoutHandler} className="bg-pink-600 text-white w-full">
                                Logout
                            </Button>
                        ) : (
                            <Button onClick={() => navigate("/login")} className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white w-full">
                                Login
                            </Button>
                        )}
                    </ul>
                </div>
            )
            }
        </header >
    )
}

export default Navbar
