import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userLogo from '../../assets/user-icons_17703682.png'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


const UserInfo = () => {


  const navigate = useNavigate()

  const [updateUser, setUpdateUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const { user } = useSelector(store => store.user)
  const params = useParams()
  const userId = params.id
  const accessToken = localStorage.getItem("accessToken");


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


  const getUserDetails = async () => {
    try {
      const GET_USER_DETAILS_API = `http://localhost:8000/api/v1/user/get-users/${userId}`
      const res = await axios(GET_USER_DETAILS_API, {
        headers: {
          Authorization: `Bearer  ${accessToken}`
        }
      })


      if (res.data.success) {
        setUpdateUser(res.data.user)

      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "Something went Wrong !")
    }
  }


  useEffect(() => {
    getUserDetails()
  }, [])


  if (!updateUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-pink-600" />
      </div>
    )
  }

  const isSelf = user?._id === updateUser?._id



  return (
    <div className=' pt-5 min-h-screen  '>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4 py-12'>
          <div className='flex justify-between gap-10 pt-10'>
            <Button onClick={() => { navigate(-1) }}><ArrowLeft /></Button>
            <h1 className='font-bold mb-7 text-2xl text-gray-800'>Update Profile</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Profile Image Section */}
            <div className="flex flex-col items-center text-center">
              <img
                src={updateUser?.profilePic || user?.profilePic || userLogo}
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
                    value={updateUser?.firstName || ""}
                    onChange={handelChange}
                    placeholder="First Name"
                  />
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={updateUser?.lastName || ""}
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
                  value={updateUser?.email || ""}
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  name="phoneNo"
                  value={updateUser?.phoneNo || ""}
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
                  value={updateUser?.address || ""}
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
                    value={updateUser?.city || ""}
                    onChange={handelChange}
                  />
                </div>

                <div>
                  <Label>Zip Code</Label>
                  <Input
                    type="text"
                    name="zipCode"
                    placeholder="Zip code"
                    value={updateUser?.zipCode || ""}
                    onChange={handelChange}
                  />
                </div>
              </div>


              {/* Role   */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium">Role:</Label>

                  <RadioGroup
                    value={updateUser?.role || "user"}
                    disabled={isSelf}
                    className="flex items-center gap-6"
                    onValueChange={(value) =>
                      setUpdateUser({ ...updateUser, role: value })
                    }
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="user" id="user" className='bg-gray-400' />
                      <Label htmlFor="user" className="cursor-pointer">
                        User
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="admin" id="admin" className='bg-gray-400' />
                      <Label htmlFor="admin" className="cursor-pointer">
                        Admin
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {isSelf && (
                  <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600 max-w-fit">
                    <span>⚠️</span>
                    <span>You can’t change your own role</span>
                  </div>
                )}
              </div>


              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition cursor-pointer"
              >
                {loading ? <> <Loader2 className="animate-spin" /> Updating... </> : "Update Profile"}
              </Button>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo