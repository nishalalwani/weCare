import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const adminSchema= mongoose.Schema({
    adminEmail:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

// hashing the password before saving the admin

adminSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }

    const salt= await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password,salt)
    next()
})

export const Admin= mongoose.model("Admin",adminSchema)