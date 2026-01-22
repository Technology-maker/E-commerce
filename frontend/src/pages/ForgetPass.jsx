import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { motion } from "framer-motion"
import { Link, Navigate, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {

            const API = import.meta.env.VITE_API_BASE_URL

            const res = await axios.post(
                `${API}/user/forgot-password`,
                { email },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            if (res.data.success) {
                toast.success(res.data.message || "OTP sent successfully")

                // ✅ STORE EMAIL for next page
                localStorage.setItem("resetEmail", email)

                // ✅ MOVE USER TO OTP + RESET PAGE
                navigate("/reset-password");
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-sm"
            >
                <Card>
                    <form onSubmit={submitHandler}>
                        <CardHeader>
                            <CardTitle>Forgot Password 🔐</CardTitle>
                            <CardDescription>
                                Enter your email and we’ll send you OTP
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-3 pt-4">
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>

                            <p className="text-sm text-gray-600">
                                Remember your password?{" "}
                                <Link to="/login" className="text-pink-700 hover:underline ">
                                    Login
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}

export default ForgotPassword
