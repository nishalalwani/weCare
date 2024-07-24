import { createPatient, generateOTP, getAllPatients, loginPatient, updatePatient, verifyOTP } from "../controllers/PatientController.js"
import express from 'express'
import {localVariables} from '../middleware/auth.js'

const router= express.Router()

router.route('/register').post(createPatient)
router.get('/',getAllPatients)
router.put('/update/:id',updatePatient)
router.post('/login',loginPatient)
router.route('/send-otp').post(localVariables,generateOTP)
router.route('/verify-otp').post(localVariables,verifyOTP)

export default router