import express from 'express';

const router = express.Router();
import { createUser } from '../controllers/userCntrl';


// POST API 
router.post("/register", createUser)

export { router as userRoute };