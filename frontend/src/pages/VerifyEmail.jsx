import axios from "axios"
import React, { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

const VerifyEmail = () => {
    const { token } = useParams()
    const hasRun = useRef(false)
    const navigate = useNavigate()

    const [status, setStatus] = useState(() =>
        token ? "Verifying your email…" : "❌ Invalid verification link"
    )

    useEffect(() => {
        if (!token || hasRun.current) return
        hasRun.current = true

        const runVerification = async () => {
            try {

                const API = import.meta.env.VITE_API_BASE_URL

                const res = await axios.post(
                    `${API}/user/verify`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (res.data.success) {
                    setStatus("✅ Email verified successfully!")
                    toast.success("Login 👇🏻 please !");
                    setTimeout(() => navigate("/login"), 2000)
                }
            } catch (error) {
                const message = error.response?.data?.message

                if (message === "Email already verified") {
                    setStatus("ℹ️ Email already verified")
                    toast.success("Login 👇🏻 please !");
                    setTimeout(() => navigate("/login"), 1000)
                    return
                }

                if (message === "Registration token has expired!") {
                    setStatus("⏳ Verification link expired")
                    toast.error("Please Reverify Your Email 😊");
                    setTimeout(() => navigate("/reverify"), 1000)
                    return
                }

                setStatus("❌ Verification failed. Please try again.")
            }
        }

        runVerification()
    }, [token, navigate])

    return (
        <div className="min-h-screen w-full bg-pink-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md">
                <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
            </div>
        </div>
    )
}

export default VerifyEmail