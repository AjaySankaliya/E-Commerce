import React from 'react'
import {createBrowserRouter,RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Home from './pages/home'
import { Toaster } from 'sonner'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOtp from './pages/VerifyOtp'
import ChangePassword from './pages/ChangePassword'

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