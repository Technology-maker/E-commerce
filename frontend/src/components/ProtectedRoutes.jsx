import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'

const ProtectedRoutes = ({ children, adminOnly = false }) => {
    const user = useSelector(state => state.user.user)

    useEffect(() => {
        if (adminOnly && user && user.role?.toLowerCase() !== "admin") {
            toast.error("Admin access only 👤!")
        }
    }, [adminOnly, user])

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (adminOnly && user.role?.toLowerCase() !== "admin") {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoutes
