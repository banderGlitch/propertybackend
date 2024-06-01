import express from 'express';

const router = express.Router();

import { createUser } from '../controllers/userCntrl.js';


// POST API

router.post("/register", createUser)

export { router as userRoutes };