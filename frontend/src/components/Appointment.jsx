import React, { useState,useEffect } from 'react'
import '../assets/style.css'
import logo from '../assets/images/logo.png'
import { useNavigate } from 'react-router-dom'
import { useMyContext } from '../Context/MyData';
import axios from 'axios';

const Appointment = () => {
  const navigate= useNavigate()
  const userData= JSON.parse(localStorage.getItem("userData"))

  useEffect(()=>{
    if(!localStorage.getItem("userData")){
      navigate('/login')
    }
  },[])
  const { setToasterMessage, setSeverityVal,registeredDrs } = useMyContext();

  const [appointmentDetails,setAppointmentDetails]= useState({
    patient:userData?._id,
    doctor:"",
    reason:"",
    notes:"",
    date:""
  })



  const onChangeHandler=(e)=>{
    setAppointmentDetails({...appointmentDetails,[e.target.name]:e.target.value})
  }
  const filterEmptyFields=(data)=>{
    return Object.fromEntries(Object.entries(data).filter(([key,val])=>val!==""))
  }

  const submitAppointmentDetails=async(e)=>{
    e.preventDefault()

    if(!appointmentDetails.doctor || !appointmentDetails.reason ||!appointmentDetails.date){
      setToasterMessage("Please fill all the required fields !")
      setSeverityVal("error")
      return;
    }

    const filteredData= filterEmptyFields(appointmentDetails)

    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };

    try {
      const { data } = await axios.post(`/appointments/create`, filteredData, config);
      setToasterMessage("Successfully sent appointment request.. Wait for mail for appointment confirmation!");
      setSeverityVal("success");

    }catch(error){
      setToasterMessage("Error Occurred!");
      setSeverityVal("error");
    }
  }
  return (
    <>
     
      <div className="container d-flex justify-content-center align-items-center vh-100">
     <div className=" p-5 w-100 custom-form-container">
      <div className="text-center">
    <img src={logo} alt="Wecare" className="mb-4 wecare-logo" /> 
        <h1>Hey there 👋</h1>
        <p>Request a new appointment in 10 seconds</p>
      </div>
      <form onSubmit={submitAppointmentDetails}>
        <div className="mb-3">
          <label className="form-label mb-3" htmlFor="doctor" >Doctor <span className="text-danger">*</span></label>
          <select className="form-select cuselectstom-"  id="doctor" name="doctor" onChange={onChangeHandler} >
          {registeredDrs?.map((dr)=>(

      <option key={dr._id} value={dr._id} >{dr.name}</option>
))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="reason">Reason for appointment <span className="text-danger">*</span></label>
          <input name="reason" type="text" className="form-control mb-3" id="reason" placeholder="ex: Annual/monthly check-up" onChange={onChangeHandler}  />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="comments">Additional comments/notes</label>
          <input name="notes" type="text" className="form-control mb-3" id="comments" placeholder="ex: Prefer afternoon appointments, if possible" onChange={onChangeHandler}  />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="appointment-date">Expected appointment date <span className="text-danger">*</span></label>
          <input name="date" type="date" className="form-control mb-3" id="appointment-date" onChange={onChangeHandler} />
        </div>
        <button type="submit" style={{ backgroundColor: "#007bff"}}className="btn btn-success w-100 my-4" onClick={()=>navigate('/Welcome')}> Edit my Details</button>
        <button type="submit" className="btn btn-success w-100 ">Submit and continue</button>
      </form>
    </div>
    </div>
    </>
  )
}

export default Appointment