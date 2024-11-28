// Required Package Import
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../../model/User_Model';

// Main User Auth Controller
const User_Auth_Controller = {
    // New User Sign Up API
    async new_User_Sign_Up(req: Request, res: Response) {
        try {

            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array(),
                });
            }

            const { name, email, password } = req.body;

            // Check if the user already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'A user with this email already exists.',
                });
            }

            // Hash the password securely
            const saltRounds = 10; // Adjust as necessary (higher rounds = slower but more secure)
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create a new user in the database
            const newUser = await UserModel.create({
                name,
                email,
                password: hashedPassword,
            });

            // Return success response
            return res.status(201).json({
                success: true,
                message: 'User signed up successfully.',
                data: newUser
            });
        } catch (error) {
            // Log the error and send a 500 response
            console.error('User_Sign_Up_Server_Error_Log:', error);

            const errorMessage =
                error instanceof Error ? error.message : 'An unknown error occurred.';

            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: errorMessage,
            });
        }
    },
};

export default User_Auth_Controller;
