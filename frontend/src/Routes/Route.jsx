import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../Components/Login/login'
import Signup from '../Components/Signup/signup'
import Home from '../Components/Home/home'
import OtpVerification from '../Components/otp/otpverify'
function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup/>}/>
      <Route path="/verify-otp" element={<OtpVerification />} />
    </Routes>
  )
}

export default Router
