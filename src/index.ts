import express from "express"

const app = express()

// MIDDLEWARE
app.use(express.json())

export default app