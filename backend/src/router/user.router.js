import express from 'express';
import * as contoller from '../controller/user.controller.js'
import { auth } from '../middleware/auth/auth.js';


export const router = express.Router();

router.get('/', auth, contoller.getUserProfile)
router.get('/admin', auth, contoller.AdminPage)
router.get('/staff', auth, contoller.staffPage)
router.get('/manager', auth, contoller.managerPage)
router.get('/user', auth, contoller.userPage)
router.post('/login', contoller.logInUser)
router.post('/password-recovery', contoller.passwordRecovery)
router.post('/register', contoller.registerUser)

