import { Request, Response, NextFunction } from "express"
import { User } from "../entity/user.entity";
import { AppDataSource } from "../database/app-data-source";
import { Book } from "../entity/book.entity";
import { Score } from "../entity/score.entity";
import { createUserSchema, returnBookSchema } from "../validator/user.validator";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error, value } = createUserSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ status: 'fail', msg: error.details[0].message });
        }

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
        res.status(500).json({ status: "fail", msg: "Users Fetching Failed" });
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

        let user = await userRepository.findOne({
            where: { id: userId },
        });

        let past = user?.books.past;
        let present = user?.books.present;

        if(past && past.length != 0) {
            //@ts-ignore
            user?.books.past = await joinValues(past, userId);

        }

        if(present && present.length != 0) {
            //@ts-ignore
            user?.books.present = await joinValues(present, userId);

        }

        if (!user) {
            return res.status(404).json({ status: 'fail', msg: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'fail', msg: 'User Retrieval Failed' });
    }
};

export const borrowBook = async (req: Request, res: Response) => {
    try {
        // converting param to number and param must be positive
        const userId = parseInt(req.params.userId, 10);

        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({ status: 'fail', msg: 'Invalid user ID' });
        }

        // Find User
        const userRepository = await AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ status: 'fail', msg: 'User not found' });
        }

        // converting param to number and param must be positive
        const bookId = parseInt(req.params.bookId, 10);

        if (isNaN(bookId) || bookId <= 0) {
            return res.status(400).json({ status: 'fail', msg: 'Invalid book ID' });
        }

        // Find Book
        const bookRepository = await AppDataSource.getRepository(Book);
        const book = await bookRepository.findOne({
            where: { id: bookId },
        });

        if (!book) {
            return res.status(404).json({ status: 'fail', msg: 'Book not found' });
        }

        if (book.status === false) {
            return res.status(400).json({ status: 'fail', msg: 'Book is not available for borrowing' });
        }

        // We added book present section
        user.books.present.push(book.id);

        // We make the loan status of the book false
        book.status = false;

        await userRepository.save(user);
        await bookRepository.save(book);

        return res.json({ status: 'success', msg: 'Book borrowed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'fail', msg: 'Borrowing book failed' });
    }
};

export const returnBook = async (req: Request, res: Response) => {
    try {
        const { error, value } = returnBookSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ status: 'fail', msg: error.details[0].message });
        }

        // converting param to number and param must be positive
        const userId = parseInt(req.params.userId, 10);

        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({ status: 'fail', msg: 'Invalid user ID' });
        }

        // Find User
        const userRepository = await AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ status: 'fail', msg: 'User not found' });
        }

        // converting param to number and param must be positive
        const bookId = parseInt(req.params.bookId, 10);

        if (isNaN(bookId) || bookId <= 0) {
            return res.status(400).json({ status: 'fail', msg: 'Invalid book ID' });
        }

        // Find Book
        const bookRepository = await AppDataSource.getRepository(Book);
        const book = await bookRepository.findOne({
            where: { id: bookId },
        });

        if (!book) {
            return res.status(404).json({ status: 'fail', msg: 'Book not found' });
        }

        // Get score from request body
        const scoreValue = parseInt(req.body.score, 10);

        if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 10) {
            return res.status(400).json({ status: 'fail', msg: 'Invalid score value' });
        }

        // Check if the user has already rated the book
        const scoreRepository = await AppDataSource.getRepository(Score);
        let existingScore = await scoreRepository.findOne({
            where: { userId, bookId },
        });

        if (existingScore) {
            // If the user has already rated the book, update the existing score
            existingScore.scoreValue = scoreValue;
            await scoreRepository.save(existingScore);
        }

        // Create new Score entity
        const score = new Score();
        score.userId = userId;
        score.bookId = bookId;
        score.scoreValue = scoreValue;

        // Save score to the database
        await scoreRepository.save(score);

        // We removed book present section
        const presentIndex = user.books.present.indexOf(book.id);

        if (presentIndex !== -1) {
            user.books.present.splice(presentIndex, 1);

            // Check if the book is already in the past section
            const isBookInPast = user.books.past.includes(book.id);

            if (!isBookInPast) {
                // We added book past section
                user.books.past.push(book.id);
            }
        } else {
            return res.status(400).json({ status: 'fail', msg: 'Book not borrowed by the user' });
        }

        // We make the loan status of the book true
        book.status = true;

        // We calculate total score
        const bookScore = await calculateScore(bookId);
        book.score = bookScore;

        await userRepository.save(user);
        await bookRepository.save(book);

        return res.json({ status: 'success', msg: 'Book returned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'fail', msg: 'Returning book failed' });
    }
};

export const calculateScore = async (bookId: number) => {
    try {
        if (isNaN(bookId) || bookId <= 0) {
            throw new Error('Invalid book ID');
        }

        // Get all scores for the given bookId
        const scoreRepository = await AppDataSource.getRepository(Score);
        const scores = await scoreRepository.find({
            where: { bookId },
        });

        // Calculate average score
        let totalScore = 0;

        for (const score of scores) {
            totalScore += score.scoreValue;
        }

        const averageScore = scores.length > 0 ? totalScore / scores.length : 0;

        // Update Book table with the calculated average score
        const bookRepository = await AppDataSource.getRepository(Book);
        const book = await bookRepository.findOne({
            where: { id: bookId },
        });

        if (!book) {
            throw new Error('Book not found');
        }
        return averageScore;
    } catch (error) {
        return -1;
    }
};

export const joinValues = async(bookArray: number[], userId: number) => {
    const bookRepository = await AppDataSource.getRepository(Book);
    const scoreRepository = await AppDataSource.getRepository(Score);

    const scores = await scoreRepository.createQueryBuilder('score')
        .select(['score.bookId', 'score.scoreValue'])
        .where('score.userId = :userId', { userId })
        .andWhere('score.bookId IN (:...bookArray)', { bookArray })
        .getMany();

    // Get only bookIds from each score object
    const bookIds = scores.map(score => score.bookId);

    // Kitap tablosundan ad değerlerini alma
    const books = await bookRepository.createQueryBuilder('book')
        .select(['book.id', 'book.name'])
        .whereInIds(bookIds)
        .getMany();

    // Find the name value corresponding to bookId in Score objects
    const result = scores.map(score => {
        const book = books.find(book => book.id === score.bookId);
        return { name: book?.name, scoreValue: score.scoreValue };
    });

    console.log(result);
    return result;
}