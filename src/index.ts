import express from "express"
import userRouter from "./router/user.router"
import bookRouter from "./router/book.router"

const app = express()

// MIDDLEWARE
app.use(express.json())

// ROUTES
app.use("/users", userRouter)
app.use("/books", bookRouter)

export default app