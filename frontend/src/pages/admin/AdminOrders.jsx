import axios from "axios";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const accessToken = localStorage.getItem("accessToken");
    const API = import.meta.env.VITE_API_BASE_URL;
    console.log(orders);
    const fetchAllOrders = async () => {
        try {
            const res = await axios.get(`${API}/all-orders`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.data.success) {
                setOrders(res.data.orders);
            } else {
                toast.error("Failed to fetch orders");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while fetching orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center gap-2 text-lg font-semibold">
                Loading orders...
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl font-bold">
                No orders found 😕
            </div>
        );
    }

    return (
        <div className="p-6 py-20 space-y-6">
            <h1 className="text-2xl font-bold">All Orders (Admin)</h1>

            {orders.map((order) => (
                <div
                    key={order._id}
                    className="border rounded-xl p-4 bg-white shadow-sm"
                >
                    {/* User Info */}
                    <div className="mb-3 text-sm text-gray-600">
                        <p>
                            <strong>User:</strong>{" "}
                            {order.user?.firstName} {order.user?.lastName}
                        </p>
                        <p>
                            <strong>Email:</strong> {order.user?.email}
                        </p>
                        <p>
                            <strong>Order Date:</strong>{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Products */}
                    <div className="space-y-3">
                        {order.products.map((item) => (
                            <div
                                key={item._id}
                                className="flex justify-between border-b pb-2"
                            >
                                <div>
                                    <p className="font-semibold">
                                        {item.productId?.productName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Qty: {item.quantity}
                                    </p>
                                </div>

                                <p className="font-semibold">
                                    ₹{item.productId?.productPrice}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Order Meta */}
                    <div className="mt-3 flex justify-between text-sm font-medium">
                        <p>
                            Status:{" "}
                            <span className="text-pink-600">{order.status}</span>
                        </p>
                        <p>Total: ₹{order.amount}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminOrders;
