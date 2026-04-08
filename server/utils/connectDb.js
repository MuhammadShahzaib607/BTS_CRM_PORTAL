import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const connectDB = async ()=> {
    // console.log(process.env.MONGO_URI)
    try {   
       await mongoose.connect(process.env.MONGO_URI)
       console.log("DB Connected Successfully")
    } catch (error) {
        console.log("DB ERROR ===>> ", error.message)
    }
}