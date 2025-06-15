import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './routes/DeliveryUserRoute.js';
import addAccountRouter from './routes/AddAccountRoutes.js'


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

//api 
app.use("/api/deliveryUser",userRouter)
app.use("/images",express.static("uploads"))
app.use("/api/account",addAccountRouter)


connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));