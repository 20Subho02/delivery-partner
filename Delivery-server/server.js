import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path';
import {connectDB} from './config/db.js'
import colors from 'colors'
import userRouter from './routes/DeliveryUserRoute.js';
import addAccountRouter from './routes/AddAccountRoutes.js';

//deployment
const _dirname = path.dirname("")
const buildpath = path.join(_dirname,"../client/build")




//app config
const app = express()
const port = process.env.PORT || 5000;
dotenv.config()

//middlewares
app.use(express.static(buildpath))
app.use(express.json())
app.use(cors({ origin: '*', credentials: true}));

//DB connection
connectDB()

//api 
app.use("/api/deliveryUser",userRouter)
app.use("/images",express.static("uploads"))
app.use("/api/account",addAccountRouter)


app.get("/", (req,res) => {
    res.send("API Working...")
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}` .bgCyan.white))