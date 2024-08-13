import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginImg from '../../assets/images/login.jpg'
import '../../assets/style.css'
import axios from 'axios'
import { useMyContext } from '../../Context/MyData'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {

    const [showPass,setShowPass]=useState(false)
    const [show,setShow]=useState(false)
    const [adminData,setAdminData]= useState({adminEmail:"",password:""})
    const [userFormData,setUserFormData]= useState({userEmail:"",fullName:""})

    const {setToasterMessage,setSeverityVal,}=useMyContext()
    const navigate= useNavigate()

    const handleToggle= ()=>{
        setShow(!show)
    }

    const handleClick=()=>setShowPass(!showPass);

    const adminChangeHandler=(e)=>{
      setAdminData({...adminData,[e.target.name]:e.target.value})
    }
  const userChangeHandler=(e)=>{
    setUserFormData({...userFormData,[e.target.name]:e.target.value})
  }

    const handleAdminLogin=async(e)=>{
      e.preventDefault()
      if(!adminData.adminEmail || !adminData.password){
        setToasterMessage("Please fill all the fields!")
        setSeverityVal("error")
        return;
      }
      const config={
        headers:{
          "Content-type":"application/json"
        }
      }
      try{
        
        console.log(adminData,"admindata")
        const {data}=await axios.post("/admin/login",adminData,config)
        // imp to keep this order url,payload,config
        setToasterMessage("Admin Login Successful!")
        setSeverityVal("success")
        localStorage.setItem("adminData",data)
          navigate('/dashboard')

        }
      catch(error){
          setToasterMessage("Error Occurred, Invalid email or password!")
          console.log(error)
          setSeverityVal("error")
        }

    }

    const handleUserLogin=async(e)=>{
      e.preventDefault()
      if(!userFormData.userEmail || !userFormData.fullName){
        setToasterMessage("Please fill all the fields!")
        setSeverityVal("error")
        return;
      }
        const config={
          headers:{
            "Content-type":"application/json"
          }
        }
        try{

          const {data}=await axios.post("/patients/login",userFormData,config)
          // imp to keep this order url,payload,config
          setToasterMessage("Patient Login Successful!")
          setSeverityVal("success")
          localStorage.setItem("userData",JSON.stringify(data))
          navigate('/welcome')

        }
      catch(error){
          setToasterMessage("Error Occurred, Invalid email!")
          console.log(error)
          setSeverityVal("error")
        }

    }


  return (
    <>

   
                <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100">
         
      {show?
    <>  <div className="col-md-6 d-flex flex-column py-3 p-lg-5 px-0 justify-content-center align-items-start bg-dark text-light position-relative">
   <h1 className="mb-3 px-5">Hi Admin, ....</h1>
    <p className="mb-4 px-5">Log in to Manage Appointments Seamlessly!</p>
    <form className='w-100  px-5' >

      <div className="form-group mb-3">
        <label htmlFor="email">Email address <span className="text-danger">*</span></label>
        <input name="adminEmail" type="email" className="form-control my-2" id="email" placeholder="adrian@jsmastery.pl" onChange={adminChangeHandler} value={adminData.adminEmail} />
      </div>
      <div className="form-group mb-3 ">
        <label htmlFor="password">Password <span className="text-danger">*</span></label>
        <div className="password-input-wrapper">
    <input
      name="password"
      type={showPass ? "text" : "password"}
      className="form-control my-2"
      id="password"
      placeholder="Enter password"
      onChange={adminChangeHandler}
      value={adminData.password}
      required
    />
    <span className='password_toggle' onClick={handleClick}>
      {showPass ? <VisibilityIcon /> : <VisibilityOffIcon />}
    </span>
  </div>
      </div>

 
  
      <button type="submit" className="btn btn-success w-100 my-4" onClick={handleAdminLogin}>Get Started</button>
      <Link to={'/signup'}>Not have an account? Sign up</Link><br/>
<Link    className='text-white ' onClick={handleToggle}>Login as User</Link>
    </form>
  </div></>:
    <>  <div className="col-md-6 d-flex flex-column py-3 p-lg-5 px-0 justify-content-center align-items-start bg-dark text-light position-relative">
 <h1 className="mb-3 px-5">Hi there, ....</h1>
    <p className="mb-4 px-5">Get Started with Appointments.</p>
    <form className='w-100  px-5' >
 <div className="form-group mb-3">
        <label htmlFor="fullName">Full name <span className="text-danger">*</span></label>
        <input name="fullName" type="text" className="form-control my-2" id="fullName" placeholder="Adrian Hajdin" onChange={userChangeHandler} />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="email">Email address <span className="text-danger">*</span></label>
        <input name="userEmail" type="email" className="form-control my-2" id="email" placeholder="adrian@jsmastery.pl" onChange={userChangeHandler} />
      </div>
  
      <button type="submit" className="btn btn-success w-100 my-4" onClick={handleUserLogin}>Get Started</button>
      <Link to={'/signup'}>Not have an account? Sign up</Link><br/>
<Link   onClick={()=>{handleToggle(); setAdminData({adminEmail:"admin@gmail.com",password:"adminpassword"})}}  className='text-white '>Get Admin Credentials</Link>

    </form>
  </div></>
  
  }
        <div className="col-md-6 d-flex justify-content-center align-items-center p-0 d-md-block d-none">
          <img src={loginImg} alt="Healthcare" className="img-fluid" style={{height:"37rem"}} />
        </div>
      </div>
    </div>
    </>
  )
}

export default Login