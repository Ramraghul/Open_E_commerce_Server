import { body } from 'express-validator';

// Validation for Sign-Up Request
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
        .withMessage('Password must contain at least one number.')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter.')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character.'),
];

// Validation for OTP Verification
export const validateOTP = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    body('otp')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be exactly 6 digits long.')
        .isNumeric()
        .withMessage('OTP must contain only numeric characters.'),
];
