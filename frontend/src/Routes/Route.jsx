import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../Components/Login/login'
import Signup from '../Components/Signup/signup'
import Home from '../Components/Home/home'
import ForgotPassword from '../Components/forgot/forgot'
import AssignProject from '../Components/project/Assignment'
import SubmissionPage from '../Components/project/ Submission'
import RecruiterDashboard from '../role/recruiter/recruiter'
import FreelancerDashboard from '../role/freelance/freelancer'
function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword/>} />
      <Route path='/ass' element={<AssignProject/>}/>
      <Route path="/submission" element={<SubmissionPage />} />
      <Route path='/signup' element={<Signup/>}/>
      <Route path="/recruiter-dashboard" element={<RecruiterDashboard/>}/>
      <Route path='/freelancer-dashboard' element={< FreelancerDashboard/>} />
    </Routes>
  )
}
export default Router
