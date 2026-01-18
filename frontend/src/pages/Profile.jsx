import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useParams } from 'react-router-dom'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import userLogo from '../assets/user-icons_17703682.png'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/userSlice'
import { Loader2 } from 'lucide-react'
import MyOrder from './MyOrder'




const Profile = () => {
    const { user } = useSelector(store => store.user)
    const parms = useParams();
    const userId = parms.userId
    const [loading, setLoading] = useState(false)
    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNo: user?.phoneNo,
        address: user?.address,
        city: user?.city,
        zipCode: user?.zipCode,
        role: user?.role
    })

    const [file, setFile] = useState(null);

    const dispatch = useDispatch()

    const handelChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }


    // handel file change 

    const handelFileChange = (e) => {

        const selectedFiles = e.target.files?.[0]
        if (!selectedFiles) return; // user cancelled file picker
        setFile(selectedFiles)
        setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFiles) })   // preview only
    }

    // submit handler
    const handlerSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;
        setLoading(true);

        const accessToken = localStorage.getItem("accessToken");

        try {
            const formData = new FormData();

            formData.append("firstName", updateUser.firstName);
            formData.append("lastName", updateUser.lastName);
            formData.append("phoneNo", updateUser.phoneNo);
            formData.append("address", updateUser.address);
            formData.append("city", updateUser.city);
            formData.append("zipCode", updateUser.zipCode);
            formData.append("role", updateUser.role);

            if (file) {
                formData.append("file", file);
            }

            const res = await axios.put(
                `http://localhost:8000/api/v1/user/update/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setUser(res.data.user));
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message || "Failed to update profile"
            );
        }
        finally {
            setLoading(false);
        }
    };


    return (
        <div className='py-20 min-h-screen bg-green-100'>
            <Tabs defaultValue="profile" className='max-w-7xl mx-auto items-center'>
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <div className="mt-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 max-w-4xl mx-auto">

                            {/* Heading */}
                            <h1 className="text-2xl font-bold text-gray-800 mb-8">
                                Update Profile
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                {/* Profile Image Section */}
                                <div className="flex flex-col items-center text-center">
                                    <img
                                        src={updateUser.profilePic || user?.profilePic || userLogo}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 shadow-md"
                                    />

                                    <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition">
                                        Change Picture
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handelFileChange}

                                        />
                                    </Label>
                                </div>

                                {/* Profile Form */}
                                <form onSubmit={handlerSubmit} className="md:col-span-2 space-y-5">

                                    {/* Name */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>First Name</Label>
                                            <Input
                                                type="text"
                                                name="firstName"
                                                value={updateUser.firstName || ""}
                                                onChange={handelChange}
                                                placeholder="First Name"
                                            />
                                        </div>

                                        <div>
                                            <Label>Last Name</Label>
                                            <Input
                                                type="text"
                                                name="lastName"
                                                value={updateUser.lastName || ""}
                                                onChange={handelChange}
                                                placeholder="Last Name"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            disabled
                                            value={updateUser.email || ""}
                                            className="bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <Label>Phone Number</Label>
                                        <Input
                                            type="text"
                                            name="phoneNo"
                                            value={updateUser.phoneNo || ""}
                                            onChange={handelChange}
                                            placeholder="Enter your phone number"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <Label>Address</Label>
                                        <Input
                                            type="text"
                                            name="address"
                                            value={updateUser.address || ""}
                                            onChange={handelChange}
                                            placeholder="Enter your full address"
                                        />
                                    </div>

                                    {/* City + Zip */}
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>City</Label>
                                            <Input
                                                type="text"
                                                name="city"
                                                placeholder="City"
                                                value={updateUser.city || ""}
                                                onChange={handelChange}
                                            />
                                        </div>

                                        <div>
                                            <Label>Zip Code</Label>
                                            <Input
                                                type="text"
                                                name="zipCode"
                                                placeholder="Zip code"
                                                value={updateUser.zipCode || ""}
                                                onChange={handelChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition"
                                    >
                                        {loading ? <> <Loader2 className="animate-spin" /> Updating... </> : "Update Profile"}
                                    </Button>

                                </form>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="orders">
                    <MyOrder />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Profile




