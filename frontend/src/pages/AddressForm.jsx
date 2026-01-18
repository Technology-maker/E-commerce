import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator';
import { addAddress, deleteAddress, setCart, setSelectedAddress } from "@/redux/productSlice";
import { Label } from '@radix-ui/react-label'
import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AddressForm = () => {
    // 1. Fixed typo: formDate -> formData
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    })

    const { cart, addresses, selectedAddress } = useSelector((store => store.product))
    // 2. Logic: If addresses exist, hide form initially.
    const [showForm, setShowForm] = useState(addresses?.length === 0)
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = () => {
        // Basic validation could go here
        dispatch(addAddress(formData))
        // Reset form after save (optional but recommended)
        setFormData({
            fullName: "", phone: "", email: "", address: "", city: "", state: "", zip: "", country: ""
        })
        setShowForm(false)
    }

    // Calculation Logic
    const subTotal = cart.totalPrice
    const shipping = subTotal > 100 ? 0 : 30
    const tax = parseFloat((subTotal * 0.05).toFixed(2))
    const total = subTotal + shipping + tax

    // 3. Extracted Payment Verification Logic to avoid repetition
    const verifyPayment = async (payload) => {
        try {
            const API = import.meta.env.VITE_API_BASE_URL;
            const res = await axios.post(`${API}/verify-payment`, payload, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return res.data;
        } catch (error) {
            console.error("Verification Error", error);
            return { success: false };
        }
    }

    const handlePayment = async () => {
        // Check if Razorpay script is loaded
        if (!window.Razorpay) {
            return toast.error("Razorpay SDK failed to load. Check your internet.");
        }

        try {
            const API = import.meta.env.VITE_API_BASE_URL;

            // Create Order
            const { data } = await axios.post(`${API}/create-order`, {
                products: cart.items.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                })),
                tax,
                shipping,
                amount: total,
                currency: "INR"
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })

            if (!data.success) {
                return toast.error("Failed to create order");
            }

            // Razorpay Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                order_id: data.order.id,
                name: "Ecommerce",
                description: "Order Payment",
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: "#F472B6" },

                // Success Handler
                handler: async function (response) {
                    const verification = await verifyPayment(response);

                    if (verification.success) {
                        toast.success("✅ Payment Successful!");
                        dispatch(setCart({ items: [], totalPrice: 0 }));
                        navigate("/order-success");
                    } else {
                        toast.error("Payment verification failed!");
                    }
                },

                // Modal Dismissed (User closed popup)
                modal: {
                    ondismiss: async function () {
                        await verifyPayment({
                            razorpay_order_id: data.order.id,
                            paymentFailed: true
                        });
                        toast.error("Payment Cancelled");
                    }
                }
            };

            const rzp = new window.Razorpay(options);

            // Failure Handler
            rzp.on("payment.failed", async function (response) {
                await verifyPayment({
                    razorpay_order_id: data.order.id,
                    paymentFailed: true
                });
                toast.error("Payment Failed. Please try again.");
                console.log(response);
            });

            rzp.open();

        } catch (error) {
            console.log(error);
            toast.error("Error initiating payment.");
        }
    }

    return (
        <div className='max-w-7xl mx-auto px-4 pt-16'>
            <div className='grid grid-cols-1 md:grid-cols-2 items-start gap-20 mt-10'>
                {/* Left Side: Address Management */}
                <div className='bg-emerald-100 p-6 rounded-lg shadow-sm'>
                    {showForm ? (
                        <>
                            <div className="flex justify-between items-center my-3">
                                <h1 className='font-bold text-lg'>Add Address</h1>
                                {/* Cancel Button added if user wants to go back to list */}
                                {addresses?.length > 0 && (
                                    <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="text-red-500 hover:text-red-700">
                                        Cancel
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor='fullName'>Full Name</Label>
                                    <Input
                                        id='fullName' name="fullName"
                                        placeholder='Ex- Aman Yadav'
                                        value={formData.fullName} onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor='phone'>Phone No.</Label>
                                    <Input
                                        id='phone' name='phone' inputMode="numeric"
                                        placeholder='+91 9876543210'
                                        value={formData.phone} onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input
                                        id='email' name='email' type='email'
                                        placeholder='Ex- jhon@gmail.com'
                                        value={formData.email} onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor='address'>Address</Label>
                                    <Input
                                        id='address' name='address'
                                        placeholder='Ex- House No, Street, Area'
                                        value={formData.address} onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <Label htmlFor='city'>City</Label>
                                        <Input
                                            id='city' name='city'
                                            placeholder='City'
                                            value={formData.city} onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor='state'>State</Label>
                                        <Input
                                            id='state' name='state'
                                            placeholder='State'
                                            value={formData.state} onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <Label htmlFor='zip'>Zip Code</Label>
                                        <Input
                                            id='zip' name='zip' inputMode="numeric"
                                            placeholder='Pincode'
                                            value={formData.zip} onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor='country'>Country</Label>
                                        <Input
                                            id='country' name='country'
                                            placeholder='Country'
                                            value={formData.country} onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleSave} className="w-full mt-6">
                                Save & Continue
                            </Button>
                        </>
                    ) : (
                        <div className='space-y-4 flex flex-col'>
                            <h2 className='text-lg font-semibold'>Select Delivery Address</h2>
                            {addresses.map((addr, index) => (
                                <div
                                    key={index}
                                    onClick={() => dispatch(setSelectedAddress(index))}
                                    className={`border p-4 rounded-md cursor-pointer relative transition-colors ${selectedAddress === index ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:bg-gray-50"}`}
                                >
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <p className='font-medium'>{addr.fullName}</p>
                                            <p className='text-sm text-gray-600'>{addr.address}, {addr.city}, {addr.state} - {addr.zip}</p>
                                            <p className='text-sm text-gray-600'>{addr.phone}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(deleteAddress(index));
                                            // Handle case where selected address is deleted
                                            if (selectedAddress === index) dispatch(setSelectedAddress(null));
                                        }}
                                        className='absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm hover:underline'
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

                            <Button variant="outline" className='w-full bg-stone-300 hover:bg-stone-400' onClick={() => setShowForm(true)}>
                                + Add New Address
                            </Button>

                            <Button
                                onClick={handlePayment}
                                disabled={selectedAddress === null || cart.items.length === 0}
                                className='w-full bg-pink-600 hover:bg-pink-700'
                            >
                                Proceed to Checkout
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right side: Order Summary */}
                <div>
                    <Card className='md:w-[400px]'>
                        <CardHeader>
                            <CardTitle className='font-bold'>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex justify-between'>
                                <span>SubTotal ({cart.items.length} items)</span>
                                <span>₹{Number(subTotal).toLocaleString()}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>Shipping</span>
                                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                                    {shipping === 0 ? "Free" : `₹${shipping}`}
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span>Tax (5%)</span>
                                <span>₹{tax}</span>
                            </div>
                            <Separator />
                            <div className='flex justify-between font-bold text-lg'>
                                <span>Total</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>

                            <div className="pt-4 space-y-2">
                                <p className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-100 px-3 py-2 rounded-md">
                                    🚚 FREE shipping on orders above ₹100
                                </p>
                                <p className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-100 px-3 py-2 rounded-md">
                                    🔒 Secure checkout via Razorpay
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AddressForm