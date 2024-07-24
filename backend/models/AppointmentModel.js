import mongoose from 'mongoose'

const appointmentSchema= new mongoose.Schema({
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Patient",
        required:true
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },
    reason: { type: String, required: true },
    notes: { type: String },
    date: { type: Date, required: true },
    status:{type:String,default:"Pending"}
})

export const Appointment= mongoose.model("Appointment",appointmentSchema)