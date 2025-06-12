import mongoose from 'mongoose'
import colors from 'colors'

export const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connect Successfully ${mongoose.connection.host}`.bgGreen.white)
    } catch (error) {
        console.log(`MongoDB Server issue ${error}`.bgRed.white)
    }
}


