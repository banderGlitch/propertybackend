import express from 'express';

const router = express.Router();

import { Residency } from '../controllers/residency.js';

// POST Residency

router.post("/residency", Residency)

export { router as residency };