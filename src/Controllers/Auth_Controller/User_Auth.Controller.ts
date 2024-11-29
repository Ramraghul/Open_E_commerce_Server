// Required Package Import
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../../model/User_Model';
import { generateOTP } from '../../middleware/Common_function/Common_function';
import { sendEmail } from '../../middleware/Email/Email_Node';

// Main User Auth Controller
export const User_Auth_Controller = {
    // New User Sign-Up API
    async new_User_Sign_Up(req: Request, res: Response) {
        try {
            // Validate request body
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

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Generate OTP
            const OTP = generateOTP();

            // Create user in database
            const newUser = new UserModel({
                name,
                email,
                password: hashedPassword,
                otp: OTP,
            });

            // Save user to the database
            await newUser.save();

            // Send verification email asynchronously
            sendEmail(email, 'Verify Your OTP', 'Congratulations! One step remains.', `<p>Your OTP is <strong>${OTP}</strong>.</p>`)
                .catch(err => console.error('Email send error:', err));

            // Respond with success
            return res.status(201).json({
                success: true,
                message: 'User signed up successfully. Please verify your email.',
                data: {
                    name: newUser.name,
                    email: newUser.email,
                },
            });
        } catch (error) {
            console.error('User_Sign_Up_Server_Error_Log:', error);

            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'An unknown error occurred.',
            });
        }
    },
};

export default User_Auth_Controller;
