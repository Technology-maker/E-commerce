import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import UserLogo from "../../assets/user-icons_17703682.png"

import { Search, Edit, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'


const AdminUsers = () => {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")


  const accessToken = localStorage.getItem("accessToken")

  const getAllUsers = async () => {
    try {


      setLoading(true)

      const API = import.meta.env.VITE_API_BASE_URL;

      const res = await axios.get(`${API}/user/all-users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (res.data.success) {
        setUsers(res.data.users)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])



  const deleteUserHandler = async (userId) => {
    try {

      const API = import.meta.env.VITE_API_BASE_URL;

      const res = await axios.delete(`${API}/user/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (res.data.success) {
        toast.success("User deleted successfully")
        setUsers(prev => prev.filter(user => user._id !== userId))
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete user")
    }
  }

  const term = searchTerm.toLowerCase()

  const filteredUsers = users.filter(user => {
    const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.toLowerCase()
    const email = user.email?.toLowerCase() ?? ""

    return name.includes(term) || email.includes(term)
  })




  return (
    <div className="py-16 mt-4 px-4 md:px-6 md:pl-[150px] min-h-screen bg-gray-100">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-bold text-2xl">User Management</h1>
        <p className="text-gray-600">View and manage registered users</p>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-[400px] mb-6">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute right-3 top-2.5 text-gray-500" />
      </div>

      {/* Users Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-4"
          >

            {/* User Info */}
            <div className="flex items-center gap-3">
              <img
                src={user?.profilePic || UserLogo}
                alt="User"
                className="w-14 h-14 rounded-full object-cover border border-pink-500"
              />

              <div className="flex flex-col overflow-hidden">
                <h1 className="font-semibold text-gray-800 truncate">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <Button onClick={() => { navigate(`/dashboard/users/${user?._id}`) }} variant='outline' size="sm" className="flex items-center gap-2" > <Edit size={16} />
                Edit
              </Button>
              <Button onClick={() => { navigate(`/dashboard/users/orders/${user?._id}`) }} ><Eye />Show Order</Button>
            </div>

          </div>
        ))}
      </div>

    </div>
  )

}

export default AdminUsers
