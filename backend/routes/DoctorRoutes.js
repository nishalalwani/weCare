import express from 'express'
import { createDoctor, getAllDoctors } from '../controllers/DoctorController.js'

const router= express.Router()

router.route('/').get(getAllDoctors)
router.route('/').post(createDoctor)

export default router