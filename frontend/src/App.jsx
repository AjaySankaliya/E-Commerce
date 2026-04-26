import React from 'react'
import {createBrowserRouter,RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Home from './pages/Home.jsx'
import { Toaster } from 'sonner'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOtp from './pages/VerifyOtp'
import ChangePassword from './pages/ChangePassword'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Navbar from './components/Navbar'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import ShippingAddress from './pages/ShippingAddress'
import PaymentMethod from './pages/PaymentMethod'
import AdminLayout from './pages/Admin/AdminLayout'
import Dashboard from './pages/Admin/Dashboard'
import Users from './pages/Admin/Users'
import AdminOrders from './pages/Admin/Orders'
import OrderDetail from './pages/Admin/OrderDetail'
import ProductDetail from './pages/ProductDetail'
import ManageProducts from './pages/Admin/ManageProducts'

const router=createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<SignUp/>
  },
  {
    path:'/verify',
    element:<Verify />
  },
  {
    path:"/verify/:token",
    element:<VerifyEmail />
  },
  {
    path:'/forgot-password',
    element:<ForgotPassword />
  },
  {
    path:'/verify-otp/:email',
    element:<VerifyOtp />
  },
  {
    path:'/change-password/:email',
    element:<ChangePassword />
  },
  {
    path:'/updateProfile/:userId',
    element:<><Navbar/><Profile /></>
  },
  {
    path:'/products',
    element:<><Navbar /><Products /></>
  },
  {
    path:'/product/:id',
    element:<><Navbar/><ProductDetail /></>
  },
  {
    path:'/cart',
    element:<><Navbar /><Cart /></>
  },
  {
    path: '/wishlist',
    element: <><Navbar /><Wishlist /></>
  },
  {
    path: '/checkout',
    element: <><Navbar /><Checkout /></>
  },
  {
    path: '/shipping',
    element: <><Navbar /><ShippingAddress /></>
  },
  {
    path: '/payment-method',
    element: <><Navbar /><PaymentMethod /></>
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'orders/:orderId', element: <OrderDetail /> },
      { path: 'products', element: <ManageProducts /> }
    ]
  }
])

const App = () => {
  return (
    <>
      <RouterProvider router={router}/>
      <Toaster />
    </>
  )
}

export default App