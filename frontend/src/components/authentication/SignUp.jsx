import React, { useState, useEffect  } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import signupImg from '../../assets/images/signup.png';
import '../../assets/style.css';
import { Link, useNavigate } from 'react-router-dom';
import { useMyContext } from '../../Context/MyData';
import axios from 'axios';
import emailjs from '@emailjs/browser'

const SignUp = () => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
  const navigate = useNavigate();
  const { setToasterMessage, setSeverityVal } = useMyContext();
  const [otp, setOtp] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    userEmail: "",
  });

  const handleOpen = () => {
      setModalOpen(true);
  };

  const handleClose = () => {
      setModalOpen(false);
  };

  const handleChange = (event) => {
      setOtp(event.target.value);
  };
   
  const onChangeHandler = (e) => {
    const {name,value}=e.target

    switch(name){
      case "fullName":
        if(!/^[a-zA-Z ]*$/.test(value)){
          setToasterMessage("Only alphabets and spaces are allowed")
          setSeverityVal("error")
        }
        break;
        case "email":
          if(!/^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)){
            setToasterMessage("Invalid Email")
            setSeverityVal("error")
          }
          else {
            // Additional check to ensure exactly one '@' symbol
            const atIndex = value.indexOf('@');
            const lastAtIndex = value.lastIndexOf('@');
            
            if (atIndex !== -1 && atIndex === lastAtIndex) {
              setFormData({ ...formData, [name]: value });
            } else {
              setToasterMessage("Email should contain exactly one '@' symbol");
              setSeverityVal("error");
            }
          }
          break;
      case "contact":
        if (value.length > 10) {
          setToasterMessage("Phone number must be exactly 10 digits");
          setSeverityVal("error");
        }
        if (!/^\d+$/.test(value)) {  
            setToasterMessage("Phone number should contain only digits");
            setSeverityVal("error");

      
        }
        break;
        

      
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(!otp){
      setToasterMessage("Please enter the OTP sent to your email!")
      setSeverityVal("error")
    }
    try{
      const config={
        headers:{
          "Content-type":"application/json"
        }
      }

      const {data}= await axios.post('/patients/verify-otp',{email:formData.userEmail,otp},config)
      setToasterMessage("SignUp Successful!");
      setSeverityVal("success");
      navigate('/welcome')
      
    }catch(error){
      console.log(error)
      setToasterMessage("Wrong OTP!")
      setSeverityVal("error")
    }
  };

  const requestOTP = async () => {
    try {
        const response = await fetch('/patients/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email:formData.userEmail })
        });
        const data = await response.json();
        sendOTPEmail(formData.userEmail, data.otp);
        setToasterMessage("OTP successfully sent to your mail!")
        setSeverityVal("success")
        handleOpen()
    } catch (error) {
      setToasterMessage("Error occurred while sending OTP to your mail account")
      setSeverityVal("error")
        console.error('Error requesting OTP:', error);
    }
}

  const sendOTPEmail = (email,otp) => {
    emailjs.send(
      'service_igu5vmy',
      'template_vyxw12q',
      {to_email: email,
      otp: otp,
      to_name: formData.fullName},
      'kNmhn7i5W6InJM1Nf'
    )
    .then((response) => {
        console.log('Email sent successfully:', response.status, response.text);
    })
    .catch((error) => {
        console.error('Failed to send email:', error);
    });
};

  const signUpHandler = async (e) => {
    e.preventDefault()

    if (!formData.fullName || !formData.contact || !formData.userEmail) {
      setToasterMessage("Please fill all the fields");
      setSeverityVal("error");
      return;
    }

    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };
    try {
      const { data } = await axios.post('/patients/register', formData, config);
      localStorage.setItem("userData", JSON.stringify(data)); 
      requestOTP()
  
    } catch (error) {
      console.log("Error: ", error.response.data); 
      setToasterMessage("SignUp failed, mailId already exists!");
      setSeverityVal("error");
    }
  };

  return (
    <>
  
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div className="row w-100">
          <div className="col-md-6 d-flex flex-column  py-3 p-lg-5 px-0 justify-content-center align-items-start bg-dark text-light position-relative">
            <h1 className="mb-3 px-5">Hi there, ....</h1>
            <p className="mb-4 px-5">Get Started with Appointments.</p>
            <form className='w-100  px-5' onSubmit={signUpHandler}>
              <div className="form-group mb-3">
                <label htmlFor="fullName">Full name <span className="text-danger">*</span></label>
                <input name="fullName" type="text" className="form-control my-2" id="fullName" placeholder="Nisha Lalwani" onChange={onChangeHandler} />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="email">Email address <span className="text-danger">*</span></label>
                <input name="userEmail" type="email" className="form-control my-2" id="email" placeholder="nisha@gmail.com" onChange={onChangeHandler} />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="phoneNumber"> Phone number <span className="text-danger">*</span></label>
                <input name="contact" type="text" className="form-control my-2" id="phoneNumber" placeholder="+91 8762345267" onChange={onChangeHandler} />
              </div>
              <button type="submit" className="btn btn-success w-100 my-4">Get Started</button>
              <Link to={"/login"} className='text-white'>Already have an account? Login</Link>
            </form>
          </div>
          <div className="col-md-6 d-flex justify-content-center align-items-center p-0 d-md-block d-none">
            <img src={signupImg} alt="Healthcare" className="img-fluid" style={{ height: "41rem" }} />
          </div>
        </div>
      </div>

      <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="otp-modal-title"
            aria-describedby="otp-modal-description"
        >
            <Box sx={style}>
                <Typography id="otp-modal-title" variant="h6" component="h2">
                    Enter OTP to SignUp
                </Typography>
                <TextField
                    id="otp-input"
                    label="OTP"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={otp}
                    onChange={handleChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className='mt-4'
                    onClick={handleSubmit}
                >
                    Submit OTP
                </Button>
            </Box>
        </Modal>
    </>
  );
};

export default SignUp;
