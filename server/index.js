import express from "express"
import { connectDB } from "./utils/connectDb.js"
import { sendRes } from "./utils/responseHandler.js"
import usersRoutes from "./routes/usersRoutes.js"
import dotenv from "dotenv"
import cors from "cors"

const app = express()
dotenv.config()
connectDB()

app.use(cors())
app.use(express.json())
app.use("/api/user", usersRoutes)

app.get("/", (req, res)=> {
    sendRes(res, 200, true, "API Hit Successfully")
})

app.get("/health_check", (req, res)=> {
    sendRes(res, 200, true, "Ok")
})

const port = process.env.PORT || "3000"
app.listen(port, ()=> {
    console.log(`server is running on port ${port}`)
})