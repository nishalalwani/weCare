import { Admin } from "../models/AdminModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Register a new admin

export const registerAdmin= async(req,res)=>{
    const {adminEmail,password}= req.body;

    try{
        let admin= await Admin.findOne({adminEmail})
        if(admin){
            return res.status(400).json({ message: 'Admin already exists'})
        }

        admin= new Admin({
            adminEmail,
            password
        })

        await admin.save()

        const token= jwt.sign({id:admin._id},process.env.JWT_SECRET,{expiresIn:'24d'})
        res.status(201).json({token})
    }catch(error){
        res.status(500).json({message:'server error'})
    }
} 

export const loginAdmin = async(req,res)=>{
    const {adminEmail,password}= req.body;
    console.log(adminEmail,password)

    try{
        const admin= await Admin.findOne({adminEmail})
        if(!admin){
            return res.status(400).json({ message:'Invalid email or password'})
        }

        const isMatch= await bcrypt.compare(password,admin.password)
        if(!isMatch){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        const token= jwt.sign({id:admin._id},process.env.JWT_SECRET,{expiresIn:'24d'})

        res.json({token})
    }catch(error){
        res.status(500).json({message: 'Server error'})
    }
}