import { Router } from "express";
import { cleanbody } from "../middlewares/cleanbody";
import { activate, login, resendOTP, signUp } from  '../src/users/user.controller';

export const router = Router()
router.post('/signup', cleanbody, signUp)
router.post('/activate', cleanbody, activate)
router.post('/resend-otp', cleanbody, resendOTP)
router.get('/login', cleanbody, login)
