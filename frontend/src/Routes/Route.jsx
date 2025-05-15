import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../Components/Login/login'
import Signup from '../Components/Signup/signup'
import Home from '../Components/Home/home'
import ForgotPassword from '../Components/forgot/forgot'
import AssignProject from '../Components/project/Assignment'
import SubmissionPage from '../Components/project/ Submission'
import RecruiterDashboard from '../role/recruiter/recruiter'
function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword/>} />
      <Route path='/ass' element={<AssignProject/>}/>
      <Route path="/submission" element={<SubmissionPage />} />
      <Route path='/signup' element={<Signup/>}/>
      <Route path="/rec" element={<RecruiterDashboard/>}/>
    </Routes>
  )
}
export default Router
