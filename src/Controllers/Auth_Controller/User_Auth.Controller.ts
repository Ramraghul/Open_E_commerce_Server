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

            // Trim input values
            const trimmedName = name.trim();
            const trimmedEmail = email.trim().toLowerCase();

            // Check if the user already exists
            const existingUser = await UserModel.findOne({ email: trimmedEmail });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'A user with this email already exists.',
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Generate OTP and expiry time (5 minutes from now)
            const OTP = generateOTP();
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

            // Create user in database
            const newUser = new UserModel({
                name: trimmedName,
                email: trimmedEmail,
                password: hashedPassword,
                otp: OTP,
                otpExpires,
            });

            // Save user to the database
            await newUser.save();

            // Send verification email asynchronously
            try {
                await sendEmail(
                    trimmedEmail,
                    'Verify Your OTP',
                    'Congratulations! One step remains.',
                    `<p>Your OTP is <strong>${OTP}</strong>. This OTP is valid for 5 minutes.</p>`
                );
            } catch (emailError) {
                console.error('Email send error:', emailError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to send OTP email. Please try again.',
                });
            }

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

    //OTP Validation;
    async otpValidation(req: Request, res: Response) {
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

            // Validate request body
            const { email, otp } = req.body;

            // Find the user by email
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.',
                });
            }

            // Check if OTP matches
            if (user.otp !== otp) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid OTP.',
                });
            }

            // Optional: Check OTP expiry (if applicable)
            if (user.otpExpires && new Date(user.otpExpires) < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'OTP has expired. Please request a new one.',
                });
            }

            // Mark user as verified
            user.isVerified = true;
            user.otp = null; // Clear OTP after validation
            user.otpExpires = null; // Clear expiry if applicable
            await user.save();

            // Respond with success
            return res.status(200).json({
                success: true,
                message: 'OTP verified successfully. Your account is now active.',
            });
        } catch (error) {
            console.error('User_OTP_Validation_Server_Error_Log:', error);

            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'An unknown error occurred.',
            });
        }
    }
};

export default User_Auth_Controller;
