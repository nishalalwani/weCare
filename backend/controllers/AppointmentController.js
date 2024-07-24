import {Appointment} from '../models/AppointmentModel.js'

const createAppointment= async(req,res)=>{
    const appointment = new Appointment(req.body)

    try{
        await appointment.save();
        res.status(201).send(appointment)
    }catch (error){
        res.status(400).send(error)
    }
}

const updateAppointment=async(req,res)=>{
    const {id}= req.params
    const updates= req.body


    try{
        const appointment= await Appointment.findByIdAndUpdate(id,updates,{
            new:true
        })

        if(!appointment){
            return res.status(404).send({message: 'Patient not found' })
        }

        res.status(200).send(appointment)
    }catch(error){
        res.status(400).send(error)
    }
}

const getAllAppointments=async(req,res)=>{
    try{
        const appointments= await Appointment.find().populate('patient').populate('doctor')
        res.status(200).send(appointments)
    }catch(error){
        res.status(500).send(error)
    }
}

export {createAppointment,getAllAppointments,updateAppointment}