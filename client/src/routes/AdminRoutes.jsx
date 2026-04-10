import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoutes = () => {
    const isAdmin = JSON.parse(localStorage.getItem("user")).isAdmin
  return (
    <>
    {
        isAdmin ?
        <Outlet /> :
        <Navigate to="/" />
    }
    </>
  )
}

export default AdminRoutes