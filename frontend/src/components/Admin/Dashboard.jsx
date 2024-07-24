import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import CustomNavbar from './Navbar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import '../../assets/style.css'
import { Button, Modal, Box, Typography, TextField, MenuItem, IconButton, getContainerUtilityClass } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMyContext } from '../../Context/MyData';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};


const Dashboard = () => {
  const { setToasterMessage, setSeverityVal,registeredDrs } = useMyContext();
  const [appointments, setAppointments] = useState([]);
  const [pendingCount, setPendingCount] = useState();
  const [scheduledCount, setScheduledCount] = useState();
  const [cancelledCount, setCancelledCount] = useState();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    doctor:{},
    date:"",
    notes:"",
    status:""
  })
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelOpen, setCancelOpen] = useState(false)
  const [open, setOpen] = useState(false);
  const navigate= useNavigate()

  const handleOpen = (appointment) => {
    setOpen(true);
    setSelectedAppointment(appointment);

  }
  const handleClose = () => setOpen(false);

const handleCancelOpen= (appointment)=>{
  setSelectedAppointment(appointment); 
  setCancelOpen(true)
};

  const handleCancelClose = () => setCancelOpen(false);

  useEffect(()=>{
    if(!localStorage.getItem("adminData")){
      navigate('/login')
    }
  },[])


  const itemsPerPage = 5;

 

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get('/appointments');
      setAppointments(data);
    } catch (error) {
      console.log('Error fetching appointments:', error);
    }
  };

  const getFormattedDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = appointments?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(appointments?.length / itemsPerPage);

  const onChangeHandlerSchedule=(e)=>{
    setAppointmentData({...appointmentData,status:"Scheduled",[e.target.name]:e.target.value})
  }
  const onChangeHandlerCancel=(e)=>{
  
    setAppointmentData({...appointmentData,status:"Cancelled",[e.target.name]:e.target.value})
  }

  const filterEmptyFields=(data)=>{
    return Object.fromEntries(Object.entries(data).filter(([key,val])=>val!==""))
  }


  const scheduleAppointment=async(e)=>{
    e.preventDefault()
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };
    const filteredData= filterEmptyFields(appointmentData)
    try {
      console.log('jhjhd',selectedAppointment._id,appointmentData)
      const { data } = await axios.put(`/appointments/update/${selectedAppointment._id}`, {...filteredData ,doctor: filteredData.doctor._id} , config);
      getAllAppointments()
      

    }catch(error){
      setToasterMessage("Error Occurred!");
      setSeverityVal("error");
      console.log(error.response.message)
    }
  }



  const sendCancelEmail = () => {
    if(!appointmentData.notes ){
      setToasterMessage("Please fill Reason for Cancellation!")
      setSeverityVal("error")
      return
    }
    emailjs.send(
      // 'service_igu5vmy',
      // 'template_ep4rpz4',
      // {to_email: selectedAppointment?.patient?.userEmail,
      // date: getFormattedDate(selectedAppointment?.date),
      // to_name: selectedAppointment?.patient.fullName,
      //  notes:appointmentData?.notes},
      // 'kNmhn7i5W6InJM1Nf'
    )
    .then((response) => {
      setToasterMessage("Successfully sent Cancellation mail to the Patient!");
      setSeverityVal("success");
        console.log('Email sent successfully:', response.status, response.text);
    })
    .catch((error) => {
        console.error('Failed to send email:', error);
    });
};

const sendConfirmationEmail = () => {
  if(!appointmentData.date || !appointmentData.doctor ){
    setToasterMessage("Please fill all the fields!")
    setSeverityVal("error")
    return
  }
  emailjs.send(
    // 'service_tkmw8nn',
    // 'template_cupx4hr',
    // {to_email: selectedAppointment?.patient?.userEmail,
    // date: getFormattedDate(appointmentData?.date),
    // to_name: selectedAppointment?.patient.fullName,
    // dr_name:appointmentData?.doctor.name
    // },
    // 'ygwybt3bCpRTxNsL8'
  )
  .then((response) => {
      console.log('Email sent successfully:', response.status, response.text);
      setToasterMessage("Successfully sent Confirmation mail to the Patient!");
      setSeverityVal("success");
  })
  .catch((error) => {
      console.error('Failed to send email:', error);
  });
};
useEffect(() => {
  getAllAppointments();
}, []);

useEffect(()=>{
   setPendingCount(appointments.filter((a)=>a.status==="Pending").length)
   setScheduledCount(appointments.filter((a)=>a.status==="Scheduled").length)
   setCancelledCount(appointments.filter((a)=>a.status==="Cancelled").length)
},[appointments])

console.log(appointmentData,"app")
console.log(registeredDrs,"drs")
  return (
    <>
      <CustomNavbar />
      <div className="min-vh-100 dashboard p-5 ">
        <header className="text-white py-3">
          <h1>Welcome, Admin</h1>
          <p>Start your day by managing new appointments</p>
        </header>
        <div className="row text-white my-4">
          <div className="col">
            <div
              style={{ borderRadius: '1rem', background: 'linear-gradient(45deg, #020b3b, #010e3314)', border: '1px solid white' }}
              className="card text-center  py-4"
            >
              <div className="card-body">
                <div className="d-flex justify-content-center align-items-center ">
                  <h2 className="mx-2">{scheduledCount}</h2>
                  <CalendarMonthIcon color="success" className="fs-2" />
                </div>
                <p>Total number of scheduled appointments</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div
              style={{ borderRadius: '1rem', background: 'linear-gradient(45deg, #020b3b, #010e3314)', border: '1px solid white' }}
              className="card text-center  py-4"
            >
              <div className="card-body">
                <div className="d-flex justify-content-center align-items-center ">
                  <h2 className="mx-2">{pendingCount}</h2>
                  <PendingActionsIcon color="primary" className="fs-2" />
                </div>
                <p>Total number of pending appointments</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div
              style={{ borderRadius: '1rem', background: 'linear-gradient(45deg, #020b3b, #010e3314)', border: '1px solid white' }}
              className="card text-center  py-4"
            >
              <div className="card-body">
                <div className="d-flex justify-content-center align-items-center ">
                  <h2 className="mx-2">{cancelledCount}</h2>
                  <WarningAmberIcon color="error" className="fs-2" />
                </div>
                <p>Total number of cancelled appointments</p>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive" style={{ marginTop: '6rem' }}>
  <table className="table table-dark table-striped">
    <thead>
      <tr>
        <th className="p-3">Patient</th>
        <th className="p-3">Date</th>
        <th className="p-3">Status</th>
        <th className="p-3">Doctor</th>
        <th className="p-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentItems?.map((appointment, index) => (
        <tr key={index}>
          <td className="p-3">{appointment?.patient?.fullName}</td>
          <td className="p-3">{getFormattedDate(appointment?.date)}</td>
          <td className={`p-3 ${appointment?.status === 'Scheduled' ? 'text-success' : appointment?.status === 'Pending' ? 'text-warning' : 'text-danger'}`}>
            {appointment?.status}
          </td>
          <td className="p-3">{appointment?.doctor?.name}</td>
          <td className="p-3">
            <button onClick={() => handleOpen(appointment)} className="btn btn-success btn-sm">Schedule</button>
            <button onClick={() => handleCancelOpen(appointment)} className="btn btn-danger btn-sm">Cancel</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        <Pagination className="justify-content-center">
          {[...Array(totalPages).keys()].map((number) => (
            <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
              {number + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="h2">
              Schedule Appointment
            </Typography>
            <IconButton onClick={handleClose} style={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <form noValidate autoComplete="off">
            <TextField
              fullWidth
              select
              label="Doctor"
              name="doctor"
              defaultValue="dr-adam-smith"
              variant="outlined"
              margin="normal"
              onChange={onChangeHandlerSchedule}
              value={appointmentData.doctor || (selectedAppointment && selectedAppointment.doctor._id) || ''}
            >
           
              {registeredDrs?.map((dr)=>(
                 <MenuItem key={dr._id} value={dr}>{dr.name}</MenuItem>
              ))}
             
            </TextField>
         
            <TextField
              fullWidth
              type="date"
              label="Appointment date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              margin="normal"
              name="date"
              onChange={onChangeHandlerSchedule}
              value={appointmentData.date || (selectedAppointment && selectedAppointment.date.split('T')[0]) || ''}
            />
            <Button className='mt-4' fullWidth variant="contained"color="success" type="submit" onClick={(e)=>{scheduleAppointment(e);sendConfirmationEmail();handleClose()}}>
              Schedule appointment
            </Button>
          </form>
        </Box>
      </Modal>
      <Modal open={cancelOpen} onClose={handleCancelClose}>
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="h2">
              Are you sure to cancel this Appointment.!
            </Typography>
            <IconButton onClick={handleCancelClose} style={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <form noValidate autoComplete="off">
      
         
            <TextField
              fullWidth
              type="text"
              label="Reason for Cancellation"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              margin="normal"
              placeholder='ex: Urgent meeting came up'
              name="notes"
              onChange={onChangeHandlerCancel}
              required
            />
            <Button className='mt-4 bg-danger text-white'  type="submit" onClick={(e)=>{scheduleAppointment(e);sendCancelEmail();handleCancelClose()}}>
              Cancel appointment
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Dashboard;
