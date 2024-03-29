import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { User } from "../entity/user.entity";
import { Book } from "../entity/book.entity";
import { Score } from "../entity/score.entity";
dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    entities: [User, Book, Score],
    synchronize: true,
    logging: false,
});