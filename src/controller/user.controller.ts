import { Request, Response, NextFunction } from "express"
import { User } from "../entity/user.entity";
import { AppDataSource } from "../database/app-data-source";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = new User();
        user.name = req.body.name;
        const userRepository = await AppDataSource.getRepository(User);
        userRepository.save(user);
        return res.status(201).json({ status: "OK", msg: "User Created Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "fail", msg: "User Creation Failed" });
    }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRepository = await AppDataSource.getRepository(User);
        const savedUsers = await userRepository.find({
            select: ["id", "name"]
        })
        return res.send(savedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "fail", msg: "User Creation Failed" });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userRepository = await AppDataSource.getRepository(User);
        // converting param to number and param must be positive
        const userId = parseInt(req.params.id, 10);

        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({ status: 'fail', msg: 'Invalid user ID' });
        }

        const user = await userRepository.findOne({
            where: { id: userId },
          });

        if (!user) {
            return res.status(404).json({ status: 'fail', msg: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'fail', msg: 'User Retrieval Failed' });
    }
};