import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoutes } from './routes/userRoute.js';
import { residency } from './routes/residencyRoute.js';

dotenv.config()

const app = express();


const PORT = process.env.PORT || 3000

//This is middleware 
app.use(express.json())
app.use(cookieParser())
app.use(cors())
//This is middleware


app.listen(PORT, (req, res) => {
    console.log(`Server running on Port ${PORT}`)

})
app.use('/api/user',  userRoutes)
app.use('/api', residency)