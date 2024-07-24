import mongoose from "mongoose";

const patientSchema= new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true,
        unique:true
    },
    DOB:{
        type:Date,
    },
    gender:{
        type:String,
        enum:['Male','Female','Other']
    },
    contact:{
        type:String,
    },
    Address:{
        type:String
    },
    Occupation:{
        type:String
    },
    physician:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor"
    },
    insuranceProvider:{
        type:String
    },
    policyNumber:{
        type:String
    },
    Allergies:{
        type:String
    },
    medications:{
        type:String
    },
    familyMedicalHistory:{
        type:String
    },
    medicalHistory:{
        type:String
    },
})

export const Patient= mongoose.model("Patient",patientSchema)