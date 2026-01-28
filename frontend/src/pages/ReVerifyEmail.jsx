import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card"
import { Loader2, Mail } from "lucide-react"

const ReVerifyEmail = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const API = import.meta.env.VITE_API_BASE_URL

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email) {
            toast.error("Please enter your email")
            return
        }

        try {
            setLoading(true)

            const res = await axios.post(
                `${API}/user/reverify`,
                { email: email.trim().toLowerCase() },
                {
                    headers: { "Content-Type": "application/json" },
                }
            )

            if (res.data.success) {
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to resend verification email"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 px-4">
            <Card className="w-full max-w-sm">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail size={20} /> Verify your email
                        </CardTitle>
                        <CardDescription>
                            Didn’t receive the verification email?
                            Enter your email and we’ll resend it.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="my-3">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                disabled={loading}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                "Resend Verification Email"
                            )}
                        </Button>

                        <p className="text-sm text-gray-600 text-center">
                            Check your <b>Spam</b> folder if you don’t see the email.
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default ReVerifyEmail
