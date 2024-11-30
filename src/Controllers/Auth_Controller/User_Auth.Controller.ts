import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../../model/User_Model';
import { generateOTP } from '../../middleware/Common_function/Common_function';
import { sendEmail } from '../../middleware/Email/Email_Node';
import jwt from 'jsonwebtoken';

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || '808940c4fe966e42c85d0d3263ecdaa9dd465ff8bd950cd4b016d7a4adebff6f';

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

    // OTP Validation
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

            // Check OTP expiry (if applicable)
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
    },

    // Resend OTP
    async ResendOtp(req: Request, res: Response) {
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

            const { email } = req.body;

            // Find the user by email
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.',
                });
            }

            // Check if the user is already verified
            if (user.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: 'User is already verified. No need to resend OTP.',
                });
            }

            // Generate a new OTP and update expiry time
            const newOTP = generateOTP();
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // Valid for 5 minutes

            user.otp = newOTP;
            user.otpExpires = otpExpires;
            await user.save();

            // Send OTP email
            try {
                await sendEmail(
                    user.email,
                    'Resend OTP',
                    'Your OTP code',
                    `<p>Your new OTP is <strong>${newOTP}</strong>. This OTP is valid for 5 minutes.</p>`
                );
            } catch (emailError) {
                console.error('Email send error:', emailError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to send OTP email. Please try again.',
                });
            }

            // Respond with success
            return res.status(200).json({
                success: true,
                message: 'OTP resent successfully. Please check your email.',
            });
        } catch (error) {
            console.error('User_Resend_Otp_Server_Error_Log:', error);

            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'An unknown error occurred.',
            });
        }
    },

    // User Sign-In
    async user_Sign_In(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required.',
                });
            }

            // Find user by email
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.',
                });
            }

            // Check if user is verified
            if (!user.isVerified) {
                return res.status(403).json({
                    success: false,
                    message: 'User is not verified. Please verify your account before logging in.',
                });
            }

            // Compare the hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password.',
                });
            }

            // Generate session token
            const sessionToken = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                },
                JWT_SECRET,
                { expiresIn: '1h' } // Token valid for 1 hour
            );

            // Respond with success and session token
            return res.status(200).json({
                success: true,
                message: 'User signed in successfully.',
                data: {
                    email: user.email,
                    name: user.name,
                    token: sessionToken,
                },
            });
        } catch (error) {
            console.error('User_Sign_In_Server_Error_Log:', error);

            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'An unknown error occurred.',
            });
        }
    },

    //User Forgot Password;
    async user_Forgot_Password(req: Request, res: Response) {
        try {
            // Validate the request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array(),
                });
            }

            const { email } = req.body;

            // Find the user by email
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.',
                });
            }

            // Generate a password reset token (JWT)
            const resetToken = jwt.sign(
                { id: user._id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' }  // Token valid for 1 hour
            );

            // Generate reset password link
            const resetLink = `${process.env.BASE_URL}/user_auth/resetPassword?token=${resetToken}`;

            // Send the reset password email
            try {
                await sendEmail(
                    user.email,
                    'Password Reset Request',
                    'Password Reset Request',
                    `<p>To reset your password, please click on the following link: <a href="${resetLink}">Reset Password</a></p>`
                );
            } catch (emailError) {
                console.error('Email send error:', emailError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to send password reset email. Please try again.',
                });
            }

            // Respond with success
            return res.status(200).json({
                success: true,
                message: 'Password reset email sent successfully. Please check your inbox.',
            });

        } catch (error) {
            console.error('User_Forgot_Password_Server_Error_Log:', error);

            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'An unknown error occurred.',
            });
        }
    },

    //User Password Update
    async user_Password_Update(req: Request, res: Response) {
        try {
            // Validate the request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array(),
                });
            }
    
            // Validate request body
            const { newPassword } = req.body;
    
            // Extract the token from the Authorization header
            const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    
            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Token is required.',
                });
            }
    
            // Define the internal interface for the decoded token
            interface DecodedToken extends jwt.JwtPayload {
                id: string;
            }
    
            // Verify the reset token
            let decoded: DecodedToken;
            try {
                decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
            } catch (err) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired token.',
                });
            }
    
            // Find the user based on the decoded token's ID
            const user = await UserModel.findOne({ _id: decoded.id });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.',
                });
            }
    
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
    
            // Update the user's password in the database
            user.password = hashedPassword;
            await user.save();
    
            // Respond with success
            return res.status(200).json({
                success: true,
                message: 'Password updated successfully.',
            });
        } catch (error) {
            console.error('User_Password_Update_Server_Error_Log:', error);
    
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'An unknown error occurred.',
            });
        }
    }    
};

export default User_Auth_Controller;
