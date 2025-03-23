import React from 'react'
// import React from 'react-router-dom'
import Login from '../Components/Login/Login'
import { Routes, Route } from 'react-router-dom';
function Router() {
  return (
    <div>
        {/* <Routes> */}
        <Route Path='/' element={<Login/>}/>
        {/* </Routes> */}
    </div>
  )
}

export default Router