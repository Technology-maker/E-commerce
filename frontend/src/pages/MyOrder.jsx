import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import OrderCart from "@/components/OrderCart";

const MyOrder = () => {
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const API = import.meta.env.VITE_API_BASE_URL; 

                const res = await axios.get(`${API}/orders/myorder`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (res.data.success) {
                    setUserOrders(res.data.orders)
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

        fetchOrders();
        window.scrollTo(0, 0);
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
                Please Wait...<Loader2 className="animate-spin" />
            </div>
        );
    }

    if (userOrders.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">No Orders Yet 😕</h2>
                <button
                    onClick={() => navigate("/products")}
                    className="px-6 py-2 bg-pink-600 text-white rounded-md"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <>
            <OrderCart userOrders={userOrders} />
        </>
    );
};

export default MyOrder;
