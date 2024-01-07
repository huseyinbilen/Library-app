import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).required()
});

export const returnBookSchema = Joi.object({
    score: Joi.number().min(1).max(10).required()
});
