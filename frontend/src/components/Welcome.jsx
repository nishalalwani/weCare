import React, { useState, useEffect } from 'react';
import '../assets/style.css';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../Context/MyData';
import axios from 'axios';

const Welcome = () => {
  const navigate = useNavigate();
  const { setToasterMessage, setSeverityVal,registeredDrs } = useMyContext();
  const userData = JSON.parse(localStorage.getItem("userData"));
  useEffect(()=>{
    if(!localStorage.getItem("userData")){
      navigate('/login')
    }
  },[])

  const [patientData, setPatientData] = useState({
    fullName: "",
    contact: "",
    DOB: "",
    gender: "",
    userEmail: "",
    Address: "",
    Occupation: "",
    physician: "",
    insuranceProvider: "",
    policyNumber: "",
    Allergies: "",
    medications: "",
    familyMedicalHistory: "",
    medicalHistory: ""
  });

  useEffect(() => {
    if (userData) {
      setPatientData({
        fullName: userData.fullName || "",
        contact: userData.contact || "",
        DOB: userData.DOB || "",
        gender: userData.gender || "",
        userEmail: userData.userEmail || "",
        Address: userData.Address || "",
        Occupation: userData.Occupation || "",
        physician: userData.physician || "",
        insuranceProvider: userData.insuranceProvider || "",
        policyNumber: userData.policyNumber || "",
        Allergies: userData.Allergies || "",
        medications: userData.medications || "",
        familyMedicalHistory: userData.familyMedicalHistory || "",
        medicalHistory: userData.medicalHistory || ""
      });
    }
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setPatientData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const filterEmptyFields=(data)=>{
    return Object.fromEntries(Object.entries(data).filter(([key,value])=>value!==""))
  }

  const submitPatientData = async (e) => {
    e.preventDefault();

    if(!patientData.fullName || !patientData.contact ||!patientData.userEmail){
      setToasterMessage("Please fill all the required fields !")
      setSeverityVal("error")
      return;
    }

    const filteredData= filterEmptyFields(patientData)

    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };

    try {
      const { data } = await axios.put(`/patients/update/${userData._id}`, filteredData, config);
      setToasterMessage("Form Data successfully sent!");
      setSeverityVal("success");
      localStorage.setItem("userData",JSON.stringify(data))
      navigate('/appointment');
    } catch(error){
      if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      setToasterMessage(`Error: ${error.response.data.message}`); // Display the specific error message from the backend
    } else if (error.request) {
      console.error('Error request:', error.request);
      setToasterMessage("No response from server.");
    } else {
      console.error('Error message:', error.message);
      setToasterMessage("Error Occurred!");
    }
    setSeverityVal("error");
  }
  };




  return (
    <>
      <div className="container p-5">
        <div className="custom-form-container">
          <h1 className="text-center">Welcome 👋</h1>
          <p className="text-center">Let us know more about yourself</p>
          <form onSubmit={submitPatientData}>
            <h3>Personal Information</h3>
            <div className="row mb-3">
              <div className="col-md-12">
                <label className="form-label" htmlFor="fullname">Fullname <span className="text-danger">*</span></label>
                <input name="fullName" type="text" className="form-control" id="fullname" placeholder="ex: Adam" value={patientData.fullName} onChange={onChangeHandler} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="phone" >Phone number <span className="text-danger">*</span></label>
                <input name="contact" type="tel" className="form-control" id="phone" placeholder="ex: +00 0342 0453 34" value={patientData.contact} onChange={onChangeHandler} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="dob">Date of birth</label>
                <input name="DOB" type="date" className="form-control" id="dob" value={patientData.DOB} onChange={onChangeHandler} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="email" >Email address <span className="text-danger">*</span></label>
                <input name="userEmail" type="email" className="form-control" id="email" placeholder="ex: adam@jsmastery.pro" value={patientData.userEmail} onChange={onChangeHandler} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="gender" id="male" value="Male" checked={patientData.gender === "Male"} onChange={onChangeHandler} />
                    <label className="form-check-label" htmlFor="male">Male</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="gender" id="female" value="Female" checked={patientData.gender === "Female"} onChange={onChangeHandler} />
                    <label className="form-check-label" htmlFor="female">Female</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="gender" id="other" value="Other" checked={patientData.gender === "Other"} onChange={onChangeHandler} />
                    <label className="form-check-label" htmlFor="other">Other</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="address">Address</label>
                <input name="Address" type="text" className="form-control" id="address" placeholder="ex: 14 street, New York, NY - 5101" value={patientData.Address} onChange={onChangeHandler} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="occupation">Occupation</label>
                <input name="Occupation" type="text" className="form-control" id="occupation" placeholder="Software Engineer" value={patientData.Occupation} onChange={onChangeHandler} />
              </div>
            </div>
            <h3 className='mt-5'>Medical Information</h3>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="physician">Primary care physician</label>
                <select name="physician" className="form-select" id="physician" value={patientData.physician} onChange={onChangeHandler}>
                  {registeredDrs?.map((dr)=>(

                  <option key={dr._id} value={dr._id} >{dr.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="insurance-provider">Insurance provider</label>
                <input name="insuranceProvider" type="text" className="form-control" id="insurance-provider" placeholder="ex: BlueCross" value={patientData.insuranceProvider} onChange={onChangeHandler} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="insurance-number">Insurance policy number</label>
                <input name="policyNumber" type="text" className="form-control" id="insurance-number" placeholder="ex: ABC1234567" value={patientData.policyNumber} onChange={onChangeHandler} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="allergies">Allergies (if any)</label>
                <input name="Allergies" type="text" className="form-control" id="allergies" placeholder="ex: Peanuts, Penicillin, Pollen" value={patientData.Allergies} onChange={onChangeHandler} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="medications">Current medications</label>
                <input name="medications" type="text" className="form-control" id="medications" placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg" value={patientData.medications} onChange={onChangeHandler} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="family-history">Family medical history (if relevant)</label>
                <input name="familyMedicalHistory" type="text" className="form-control" id="family-history" placeholder="ex: Mother had breast cancer" value={patientData.familyMedicalHistory} onChange={onChangeHandler} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="past-history">Past medical history</label>
                <input name="medicalHistory" type="text" className="form-control" id="past-history" placeholder="ex: Asthma diagnosis in childhood" value={patientData.medicalHistory} onChange={onChangeHandler} />
              </div>
            </div>
            <button type="submit" className="btn btn-success w-100 my-4">Book an Appointment</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Welcome;
