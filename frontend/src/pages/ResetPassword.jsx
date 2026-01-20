import React, { useState } from "react"
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { motion } from "framer-motion"
import axios from "axios"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ResetPassword = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isOtpVerified, setIsOtpVerified] = useState(false)

    const [formData, setFormData] = useState({
        otp: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // 🔹 STEP 1: VERIFY OTP
    const verifyOtpHandler = async () => {
    if (!formData.otp) return toast.error("Please enter OTP")

    setLoading(true)
    try {
        const email = localStorage.getItem("resetEmail")

        const res = await axios.post(
            `http://localhost:8000/api/v1/user/verify-otp/${email}`,
            { otp: formData.otp }
        )

        if (res.data.success) {
            toast.success("OTP verified successfully ✅")
            setIsOtpVerified(true)
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Invalid OTP")
    } finally {
        setLoading(false)
    }
}

    // 🔹 STEP 2: RESET PASSWORD
    const resetPasswordHandler = async (e) => {
    e.preventDefault()

    setLoading(true)
    try {
        const email = localStorage.getItem("resetEmail")
        const encodedEmail = encodeURIComponent(email)

        const res = await axios.post(
            `http://localhost:8000/api/v1/user/change-password/${encodedEmail}`,
            {
                newPassword: formData.password,
                confirmPassword: formData.confirmPassword
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        if (res.data.success) {
            toast.success("Password changed successfully 🎉")
            localStorage.removeItem("resetEmail")
            navigate("/login")
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to reset password")
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
                    <CardHeader>
                        <CardTitle>Reset Password 🔑</CardTitle>
                        <CardDescription>
                            {isOtpVerified
                                ? "Set your new password"
                                : "Enter OTP sent to your email"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-4">

                        {/* OTP INPUT */}
                        {!isOtpVerified && (
                            <div className="grid gap-2">
                                <Label>OTP</Label>
                                <Input
                                    name="otp"
                                    placeholder="Enter 6-digit OTP"
                                    value={formData.otp}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {/* PASSWORD INPUTS (AFTER OTP VERIFIED) */}
                        {isOtpVerified && (
                            <>
                                <div className="grid gap-2">
                                    <Label>New Password</Label>
                                    <div className="relative">
                                        <Input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="New password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Confirm Password</Label>
                                    <Input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                    </CardContent>

                    <CardFooter>
                        {!isOtpVerified ? (
                            <Button onClick={verifyOtpHandler} disabled={loading} className="w-full">
                                {loading ? <Loader2 className="animate-spin mr-2" /> : "Verify OTP"}
                            </Button>
                        ) : (
                            <Button onClick={resetPasswordHandler} disabled={loading} className="w-full">
                                {loading ? <Loader2 className="animate-spin mr-2" /> : "Reset Password"}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}

export default ResetPassword
