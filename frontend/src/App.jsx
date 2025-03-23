import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import {Routes,Route} from 'react-router-dom'
import './App.css'
// import Route from './Routes/Route'
// import { BrowserRouter } from 'react-router-dom';
import Router from './Routes/Route'
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    {/* <BrowserRouter> */}
      <Router/>
    {/* </BrowserRouter> */}
    
    </>
  )
}

export default App
