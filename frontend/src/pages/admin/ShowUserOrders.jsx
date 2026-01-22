import OrderCart from '@/components/OrderCart';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const ShowUserOrders = () => {
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const parms = useParams()



    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const API = import.meta.env.VITE_API_BASE_URL; 
                console.log(parms);

                const res = await axios.get(`${API}/orders/user-orders/${parms.userId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (res.data.success) {
                    setUserOrders(res.data.orders)
                } else {
                    toast.error("Failed to fetch User orders");
                }
            } catch (error) {
                console.log("Error - ", error);
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
                <h2 className="text-2xl font-bold">This Use Cannot Make Orders Yet 😕</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-pink-600 text-white rounded-md"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className='py-20'>
            <OrderCart userOrders={userOrders} />
        </div>
    )
}

export default ShowUserOrders