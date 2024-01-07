import express from "express"
import * as bookController from "../controller/book.controller"
const bookRouter = express.Router()


bookRouter.post("/",bookController.createBook)
bookRouter.get("/",bookController.getBooks)
bookRouter.get("/:id",bookController.getBookById)

export default bookRouter;