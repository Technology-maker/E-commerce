import React, { useState } from 'react'
import { Button } from "../components/ui/button"
import { motion } from "framer-motion"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card"




const Login = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        email: "",
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        const API = import.meta.env.VITE_API_BASE_URL

        try {
            const res = await axios.post(`${API}/user/login`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.data.success) {

                dispatch(setUser(res.data.user))
                localStorage.setItem("accessToken", res.data.accessToken)
                localStorage.setItem("refreshToken", res.data.refreshToken)
                navigate("/")
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong")
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center   from-pink-100 via-rose-100 to-pink-200 px-4'>

            {/* motion  */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-sm"
            >
                <Card className="w-full max-w-sm">
                    <form onSubmit={submitHandler}>

                        <CardHeader>
                            <CardTitle>Login to Your Account 🚀</CardTitle>
                            <CardDescription>
                                Start your journey with us today
                            </CardDescription>
                        </CardHeader>
                        <CardContent>

                            <div className="flex flex-col gap-6 py-4">
                                <div className='grid gap-2'>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Your Email !"
                                        name="email"
                                        required
                                        disabled={loading}
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                    />
                                </div>





                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>

                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            placeholder="Enter Your password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            disabled={loading}
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete="current-password"
                                        />

                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-pink-700 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>

                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex-col gap-2">

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full cursor-pointer"
                            >
                                {loading ? <><Loader2 className='h-4 w-4 animate-spin mr-2' /> Please Wait!</> : "Login"}
                            </Button>

                            <p className='text-gray-700 text-sm'>Don't have an account? <Link to={'/signup'} className='hover:underline cursor-pointer text-pink-800'>Signup</Link> </p>

                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div >
    )
}

export default Login