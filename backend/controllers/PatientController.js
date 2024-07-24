import {Patient} from '../models/PatientModel.js'
import otpGenerator from 'otp-generator'

const createPatient = async (req, res) => {
    try {
      const { userEmail } = req.body;
      let patient = await Patient.findOne({ userEmail });
  
      if (patient) {
        return res.status(400).json({ message: 'Patient already exists' });
      }
  
      patient = new Patient(req.body);
      await patient.save();
      res.status(201).send(patient);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  


const getAllPatients=async(req,res)=>{
    try{
        const patients= await Patient.find()
        res.status(200).send(patients)
    }
    catch(error){
        res.status(500).send(error)
    }
}

const loginPatient= async(req,res)=>{
    const {fullName,userEmail}= req.body

    try{
        const patient= await Patient.findOne({userEmail})
        if(!patient){
            return res.status(404).send({ message: 'Patient not found' })
        }

        res.status(200).send(patient)
    }catch(error){
        res.status(500).send(error)
    }
}

const updatePatient=async(req,res)=>{
    const {id}= req.params;
    const updates=req.body

    try{
        const patient= await Patient.findByIdAndUpdate(id,updates,{
            new:true
        })

        if(!patient){
            return res.status(404).send({message: 'Patient not found' })
        }

        res.status(200).send(patient)
    }catch(error){
        res.status(400).send(error)
    }
}

const generateOTP = async (req, res) => {
    const { email } = req.body;
    const otp =  otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    console.log(otp)
    req.app.locals.otp = otp;
    console.log(req.app.locals.otp,"reqqq")
    req.app.locals.email = email;

    // Send OTP back to frontend for email sending
    res.status(200).send({ otp });
};

const verifyOTP = async(req,res)=>{
    const { email, otp } = req.body;
    console.log(email,otp)
    console.log(req.app.locals.otp,req.app.locals.email)
    if (req.app.locals.email === email && req.app.locals.otp === otp) {
      res.status(200).send('OTP verified');
    } else {
      res.status(400).send('Invalid OTP');
    }
  };

export {getAllPatients,createPatient,loginPatient,updatePatient,verifyOTP,generateOTP}