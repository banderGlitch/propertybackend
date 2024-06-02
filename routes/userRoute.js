import express from 'express';

const router = express.Router();

import { createUser, bookVisit, getAllBookings, cancelBookings, toFav , allFav } from '../controllers/userCntrl.js';


// POST and UPDATE API

router.post("/register", createUser)
router.post("/bookVisit/:id",bookVisit)
router.post("/allbooking", getAllBookings)
router.post("/deletebookings/:id", cancelBookings )
router.post("/tofav/:rid", toFav)
router.get("/allfav",  allFav)

export { router as userRoutes };