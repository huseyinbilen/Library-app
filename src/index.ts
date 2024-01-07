import express from "express"
import userRouter from "./router/user.router"

const app = express()

// MIDDLEWARE
app.use(express.json())

// ROUTES
app.use("/users", userRouter)

export default app