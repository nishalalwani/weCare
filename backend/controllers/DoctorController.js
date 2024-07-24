import {Doctor} from '../models/DoctorModel.js'

const createDoctor=async(req,res)=>{
    const doctor = new Doctor(req.body)

    try{
        await doctor.save()
        res.status(201).send(doctor)
    }catch(error){
        res.status(400).send(error)
    }
}

const getAllDoctors=async(req,res)=>{
    try{
        const doctors= await Doctor.find()
        res.status(200).send(doctors)
    }catch(error){
        res.status(500).send(error)
    }
}

export {createDoctor,getAllDoctors}