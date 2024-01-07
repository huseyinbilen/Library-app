import express from "express"
import * as userController from "../controller/user.controller"
const userRouter = express.Router()


userRouter.post("/",userController.createUser)
userRouter.get("/",userController.getUsers)
userRouter.get("/:id",userController.getUserById)
userRouter.post("/:userId/borrow/:bookId",userController.borrowBook)
userRouter.post("/:userId/return/:bookId",userController.returnBook)

export default userRouter;