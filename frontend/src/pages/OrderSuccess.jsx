import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const userId = useSelector(state => state.user.user?._id);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="max-w-md w-full shadow-lg rounded-2xl">
                <CardContent className="flex flex-col items-center text-center py-10 space-y-6">

                    {/* Success Icon */}
                    <CheckCircle2 className="h-20 w-20 text-green-500" />

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-800">
                        Order Placed Successfully 🎉
                    </h1>

                    {/* Message */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Thank you for your purchase!
                        Your payment was successful and your order is being processed.
                    </p>

                    {/* Actions */}
                    <div className="w-full space-y-3 pt-4">
                        <Button
                            className="w-full bg-pink-600 hover:bg-pink-700"
                            onClick={() => navigate(`/profile/${userId}`)}
                        >
                            View My Orders
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => navigate(`/products/`)}
                        >
                            Continue Shopping
                        </Button>
                    </div>

                    {/* Footer Note */}
                    <p className="text-xs text-gray-500 pt-4">
                        📦 You’ll receive order updates via email.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderSuccess;
