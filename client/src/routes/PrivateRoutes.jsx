import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const verifyToken = async () => {
        const token = localStorage.getItem("token")
        
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const res = await axios.post(`${apiBaseUrl}api/user/check-token`, { token })
            if (res.data.success) {
                setIsAuthenticated(true);
            } else {
                throw new Error("Invalid");
            }
        } catch (error) {
            // console.log("Auth Error:", error.response?.data?.message || "Invalid Token");
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            setIsAuthenticated(false);
        }
    }

    useEffect(() => {
        verifyToken()
    }, [])

    if (isAuthenticated === null) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes