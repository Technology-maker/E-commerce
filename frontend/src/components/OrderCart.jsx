import React from 'react'
import { Navigate } from 'react-router-dom';

const OrderCart = ({ userOrders }) => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            <div className="space-y-6">
                {userOrders.map((order) => (
                    <div
                        key={order._id}
                        className="border rounded-lg p-5 shadow-lg bg-white"
                    >
                        {/* Order Header */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Order ID: <span className="font-medium">{order._id}</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    Date: {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <span
                                className={`mt-2 md:mt-0 px-3 py-1 text-sm rounded-full w-fit
                                    ${order.status === "Paid"
                                        ? "bg-green-200 text-green-700"
                                        : order.status === "Pending"
                                            ? "bg-yellow-200 text-yellow-700"
                                            : "bg-red-200 text-red-700"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>


                        {/* userinfo  */}
                        <div className="flex justify-between items-center">
                            <div className="mb-4">
                                <p className="text-sm text-gray-700 ">
                                    <span className="font-medium">User Name:</span>{" "}{order.user?.firstName || "Unknown"} {order.user?.lastName}
                                </p>
                                <p className="text-sm text-gray-500 ">
                                    <span className="">Email:</span>{" "}{order.user?.email || "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="space-y-4">
                            {order.products.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 border-b pb-3 last:border-b-0 cursor-pointer"
                                    onClick={() => { Navigate(`/products/${item?.productId._id}`) }}
                                >
                                    <img
                                        src={item.productId?.productImg[0].url}
                                        alt={item.productId?.productName[0].url}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />

                                    <div className="flex-1">
                                        <p className="font-semibold line-clamp-2 ">
                                            {item.productId?.productName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="font-medium">
                                        ₹{item.productId?.productPrice}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Price Summary */}
                        <div className="mt-4 flex justify-between font-semibold">
                            <span>Total Amount</span>
                            <span>₹{order.amount}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OrderCart;