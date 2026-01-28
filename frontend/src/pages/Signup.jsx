import React, { useState } from 'react'
import { Button } from "../components/ui/button"
import { motion } from "framer-motion"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card"


const Signup = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: '',
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

        try {

            const API = import.meta.env.VITE_API_BASE_URL;

            const res = await axios.post(`${API}/user/register`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.data.success) {
                navigate("/verify")
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
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 px-4'>

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
                            <CardTitle>Create Account ✨</CardTitle>
                            <CardDescription>
                                Start your journey with us today
                            </CardDescription>
                        </CardHeader>
                        <CardContent>

                            <div className="flex flex-col gap-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className='grid gap-2'>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id='firstName'
                                            name='firstName'
                                            type="text"
                                            placeholder="Sahil"
                                            required
                                            disabled={loading}
                                            value={formData.firstName}
                                            onChange={handleChange}

                                        >
                                        </Input>
                                    </div>

                                    <div className='grid gap-2'>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id='lastName'
                                            name='lastName'
                                            type="text"
                                            placeholder="Yadav"
                                            required
                                            disabled={loading}
                                            value={formData.lastName}
                                            onChange={handleChange}


                                        >
                                        </Input>
                                    </div>

                                </div>
                                <div className='grid gap-2'>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@gmail.com"
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
                                            placeholder="Create a password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            disabled={loading}
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete="new-password"
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

                                    <p className="text-sm text-gray-600 py-1.5">
                                        Didn’t receive the email?{" "}
                                        <Link to="/reverify" className="text-pink-700 hover:underline">
                                            Resend verification
                                        </Link>
                                    </p>


                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex-col gap-2">

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full cursor-pointer"
                            >
                                {loading ? <><Loader2 className='h-4 w-4 animate-spin mr-2' /> Please Wait!</> : "Signup"}
                            </Button>

                            <p className='text-gray-700 text-sm'>Already have an account? <Link to={'/login'} className='hover:underline cursor-pointer text-pink-800'>Login</Link> </p>

                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div >
    )
}

export default Signup