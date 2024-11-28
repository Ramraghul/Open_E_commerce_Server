import { body } from 'express-validator';

export const validateSignUp = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required.')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long.'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.')
        .matches(/\d/)
        .withMessage('Password must contain at least one number.'),
];
