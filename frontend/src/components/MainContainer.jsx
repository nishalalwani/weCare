import React from 'react'
import {Route,Routes} from 'react-router-dom'
import SignUp from './authentication/SignUp'
import backImg from '../assets/images/appback.webp'
import Welcome from './Welcome';
import Appointment from './Appointment';
import Dashboard from './Admin/Dashboard';
import Login from './authentication/Login';
import { useMyContext } from '../Context/MyData';
import Toaster from './Toaster';

const MainContainer = () => {
    const {toasterMessage,severityVal,snackbarOpen,handleSnackbarClose}=useMyContext()

  return (
    <>
     <div  style={{background:`linear-gradient(rgb(1 12 28), #000000a1) ,url(${backImg})`,backgroundRepeat:'no-repeat',backgroundPosition:'center',backgroundSize:'cover'}}>
    <Toaster message={toasterMessage} severity={severityVal} open={snackbarOpen} handleClose={handleSnackbarClose} />
    <Routes>
      <Route path='/' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/welcome' element={<Welcome/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/appointment' element={<Appointment/>}/>

    </Routes>
    </div>
    </>
  )
}

export default MainContainer