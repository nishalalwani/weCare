import express from 'express'
import { createAppointment, getAllAppointments, updateAppointment } from '../controllers/AppointmentController.js'

const Route= express.Router()

Route.post('/create',createAppointment)
Route.put('/update/:id',updateAppointment)
Route.route('/').get(getAllAppointments)

export default Route