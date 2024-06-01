import express from 'express';

const router = express.Router();

import { Residency } from '../controllers/residency.js';
import { getAllResidencies } from '../controllers/residency.js';
import { getResidency } from '../controllers/residency.js';


// POST Residency

router.post("/residency", Residency)
router.get("/allresidency", getAllResidencies)
router.get(`/residency/:id`, getResidency)


export { router as residency };