import express from "express";
import dotenv from 'dotenv'
import connectDB from "./config/db.js";
import patientsRouter from './routes/PatientRoutes.js'
import doctorsRouter from './routes/DoctorRoutes.js'
import appointmentsRouter from './routes/AppointmentRoutes.js'
import adminRouter from './routes/AdminRouter.js'
import cors from 'cors'
import path from 'path'


dotenv.config()
connectDB()
const app= express()
app.use(cors({
        origin:"*",
        methods: ["GET", "POST","PUT"],
        credentials: true
}))
app.use(express.json())



app.use('/patients',patientsRouter)
app.use('/doctors',doctorsRouter)
app.use('/appointments',appointmentsRouter)
app.use('/admin',adminRouter)

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------



const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})