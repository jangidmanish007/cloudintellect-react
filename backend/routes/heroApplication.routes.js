import express from 'express'
import { submitHeroApplication } from '../controllers/heroApplication.controller.js'

const router = express.Router()

router.post('/submit', submitHeroApplication)

export default router
