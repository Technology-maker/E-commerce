import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminSalse = () => {
    const accessToken = localStorage.getItem("accessToken");
    const API = import.meta.env.VITE_API_BASE_URL;

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalSales: 0,
        salesByDate: [],
    });

    const [loading, setLoading] = useState(true);

    const fetchStates = async () => {
        try {
            const res = await axios.get(`${API}/sales`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log("Sales API Response:", res.data);

            if (res.data.success) {
                setStats({
                    totalUsers: res.data.totalUsers,
                    totalProducts: res.data.totalProducts,
                    totalOrders: res.data.totalOrders,
                    totalSales: res.data.totalSales,
                    salesByDate: res.data.salesByDate || [],
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStates();
    }, []);

    if (loading) {
        return (
            <div className="py-32 md:pl-[300px] text-center text-lg font-semibold">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="py-20 md:pl-[300px] bg-gray-100 min-h-screen pr-6 px-4">
            <h1 className="text-3xl font-bold mb-8">Admin Sales Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                <StatCard title="Total Users" value={stats.totalUsers} />
                <StatCard title="Total Products" value={stats.totalProducts} />
                <StatCard title="Total Orders" value={stats.totalOrders} />
                <StatCard title="Total Sales" value={`₹ ${stats.totalSales}`} />
            </div>

            {/* Sales by Date */}
            <Card>
                <CardHeader>
                    <CardTitle>Sales By Date</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.salesByDate.length === 0 ? (
                        <p className="text-gray-500">No sales data available</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="py-2">Date</th>
                                        <th className="py-2">Orders</th>
                                        <th className="py-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.salesByDate.map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="py-2">
                                                {new Date(item.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-2">{item.orders}</td>
                                            <td className="py-2">
                                                ₹ {item.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const StatCard = ({ title, value }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
};

export default AdminSalse;
