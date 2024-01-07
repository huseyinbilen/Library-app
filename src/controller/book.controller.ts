import { Request, Response, NextFunction } from "express"
import { Book } from "../entity/book.entity";
import { AppDataSource } from "../database/app-data-source";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = new Book();
        book.name = req.body.name;
        const bookRepository = await AppDataSource.getRepository(Book);
        bookRepository.save(book);
        return res.status(201).json({ status: "OK", msg: "Book Created Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "fail", msg: "Book Creation Failed" });
    }
}

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookRepository = await AppDataSource.getRepository(Book);
        const savedBooks = await bookRepository.find({
            select: ["id", "name"]
        })
        return res.send(savedBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "fail", msg: "Book Creation Failed" });
    }
}

export const getBookById = async (req: Request, res: Response) => {
    try {
        const bookRepository = await AppDataSource.getRepository(Book);
        // converting param to number and param must be positive
        const bookId = parseInt(req.params.id, 10);

        if (isNaN(bookId) || bookId <= 0) {
            return res.status(400).json({ status: 'fail', msg: 'Invalid book ID' });
        }

        const book = await bookRepository.findOne({
            where: { id: bookId },
            select: ["id", "name", "score"]
          });

        if (!book) {
            return res.status(404).json({ status: 'fail', msg: 'Book not found' });
        }
        return res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'fail', msg: 'Book Retrieval Failed' });
    }
};