const BaseUrlVersion = "api/v1";


const userAuthSwagger = {
    paths: {
        [`/${BaseUrlVersion}/user_auth/signUp`]: {
            post: {
                tags: ['User Auth'],
                summary: 'User Sign Up',
                description: 'API for new user registration. Sends an OTP to the provided email for verification.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        example: 'John Doe',
                                        description: 'Name of the user.',
                                    },
                                    email: {
                                        type: 'string',
                                        example: 'johndoe@example.com',
                                        description: 'Email of the user.',
                                    },
                                    password: {
                                        type: 'string',
                                        example: 'password123',
                                        description: 'Password for the user account.',
                                    },
                                },
                                required: ['name', 'email', 'password'],
                            },
                            example: {
                                name: 'John Doe',
                                email: 'johndoe@example.com',
                                password: 'password123',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User successfully signed up and OTP sent',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: {
                                            type: 'string',
                                            example: 'User signed up successfully. Please verify your email.',
                                        },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                name: { type: 'string', example: 'John Doe' },
                                                email: { type: 'string', example: 'johndoe@example.com' },
                                            },
                                        },
                                    },
                                },
                                example: {
                                    success: true,
                                    message: 'User signed up successfully. Please verify your email.',
                                    data: {
                                        name: 'John Doe',
                                        email: 'johndoe@example.com',
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Validation failed',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Validation failed',
                                    errors: [
                                        { msg: 'Name is required.', param: 'name', location: 'body' },
                                        { msg: 'Invalid email format.', param: 'email', location: 'body' },
                                    ],
                                },
                            },
                        },
                    },
                    409: {
                        description: 'Conflict - User already exists',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'A user with this email already exists.',
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Server Error',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Internal Server Error',
                                    error: 'An unknown error occurred.',
                                },
                            },
                        },
                    },
                },
            },
        },
        [`/${BaseUrlVersion}/user_auth/otpValidation`]: {
            patch: {
                tags: ['User Auth'],
                summary: 'OTP Validation',
                description: 'API to validate the OTP sent to the user’s email address during sign-up.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        example: 'johndoe@example.com',
                                        description: 'Email of the user.',
                                    },
                                    otp: {
                                        type: 'string',
                                        example: '123456',
                                        description: 'OTP sent to the user’s email.',
                                    },
                                },
                                required: ['email', 'otp'],
                            },
                            example: {
                                email: 'johndoe@example.com',
                                otp: '123456',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'OTP successfully validated',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: {
                                            type: 'string',
                                            example: 'OTP verified successfully. Your account is now active.',
                                        },
                                    },
                                },
                                example: {
                                    success: true,
                                    message: 'OTP verified successfully. Your account is now active.',
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid OTP or expired OTP',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'OTP has expired. Please request a new one.',
                                },
                            },
                        },
                    },
                    404: {
                        description: 'User not found',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'User not found.',
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Server Error',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Internal Server Error',
                                    error: 'An unknown error occurred.',
                                },
                            },
                        },
                    },
                },
            },
        },
        [`/${BaseUrlVersion}/user_auth/resendOTP`]: {
            post: {
                tags: ['User Auth'],
                summary: 'Resend OTP',
                description: 'API to resend the OTP to a user’s registered email address if not verified.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        example: 'johndoe@example.com',
                                        description: 'The email address of the user.',
                                    },
                                },
                                required: ['email'],
                            },
                            example: {
                                email: 'johndoe@example.com',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'OTP successfully resent to the user’s email.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'OTP resent successfully. Please check your email.' },
                                    },
                                },
                                example: {
                                    success: true,
                                    message: 'OTP resent successfully. Please check your email.',
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Validation failed or bad request.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Validation failed',
                                    errors: [
                                        { msg: 'Please provide a valid email address.', param: 'email', location: 'body' },
                                    ],
                                },
                            },
                        },
                    },
                    404: {
                        description: 'User not found.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'User not found.',
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Server error.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Internal Server Error',
                                    error: 'An unknown error occurred.',
                                },
                            },
                        },
                    },
                },
            },
        },
        [`/${BaseUrlVersion}/user_auth/signIn`]: {
            post: {
                tags: ['User Auth'],
                summary: 'User Sign In',
                description: 'API to sign in a user with email and password, returning a session token.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        example: 'johndoe@example.com',
                                        description: 'The email address of the user.',
                                    },
                                    password: {
                                        type: 'string',
                                        example: 'password123',
                                        description: 'The password of the user.',
                                    },
                                },
                                required: ['email', 'password'],
                            },
                            example: {
                                email: 'johndoe@example.com',
                                password: 'password123',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'User successfully signed in and session token returned.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'User signed in successfully.' },
                                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDU2IiwiaWF0IjoxNjEwOTg1Mzc2LCJleHBpcmVkX3N0ZCI6IjExMjM0NTY3OCJ9.Jt7jTk92J6vGdHjcL6mrAbfwHK4R0I3hHiT76Lh4Q6A' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'string', example: '123456' },
                                                email: { type: 'string', example: 'johndoe@example.com' },
                                                name: { type: 'string', example: 'John Doe' },
                                            },
                                        },
                                    },
                                },
                                example: {
                                    success: true,
                                    message: 'User signed in successfully.',
                                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDU2IiwiaWF0IjoxNjEwOTg1Mzc2LCJleHBpcmVkX3N0ZCI6IjExMjM0NTY3OCJ9.Jt7jTk92J6vGdHjcL6mrAbfwHK4R0I3hHiT76Lh4Q6A',
                                    data: {
                                        id: '123456',
                                        email: 'johndoe@example.com',
                                        name: 'John Doe',
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Validation failed or bad request.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Validation failed',
                                    errors: [
                                        { msg: 'Email is required.', param: 'email', location: 'body' },
                                        { msg: 'Password is required.', param: 'password', location: 'body' },
                                    ],
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized - Invalid email or password.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Invalid email or password.',
                                },
                            },
                        },
                    },
                    403: {
                        description: 'Forbidden - User is not verified.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'User is not verified. Please verify your account before logging in.',
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Server error.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Internal Server Error',
                                    error: 'An unknown error occurred.',
                                },
                            },
                        },
                    },
                },
            },
        },
        [`/${BaseUrlVersion}/user_auth/forgotPassword`]: {
            post: {
                tags: ['User Auth'],
                summary: 'User Forgot Password',
                description: 'API to initiate a password reset by sending a reset link to the user’s registered email.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        example: 'johndoe@example.com',
                                        description: 'The email address of the user.',
                                    },
                                },
                                required: ['email'],
                            },
                            example: {
                                email: 'johndoe@example.com',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Password reset email sent successfully.',
                        content: {
                            'application/json': {
                                example: {
                                    success: true,
                                    message: 'Password reset email sent successfully. Please check your inbox.',
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Validation failed or bad request.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Validation failed',
                                    errors: [
                                        { msg: 'Email is required.', param: 'email', location: 'body' },
                                    ],
                                },
                            },
                        },
                    },
                    404: {
                        description: 'User not found.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'User not found.',
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Server error.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Internal Server Error',
                                    error: 'An unknown error occurred.',
                                },
                            },
                        },
                    },
                },
            },
        },
        [`/${BaseUrlVersion}/user_auth/updateNewPassword`]: {
            post: {
                tags: ['User Auth'],
                summary: 'Update New Password',
                description: 'API to update the user’s password using a valid password reset token passed in the Authorization header.',
                security: [
                    {
                        BearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    newPassword: {
                                        type: 'string',
                                        example: 'newpassword123',
                                        description: 'The new password to set for the user.',
                                    },
                                },
                                required: ['newPassword'],
                            },
                            example: {
                                newPassword: 'newpassword123',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Password updated successfully.',
                        content: {
                            'application/json': {
                                example: {
                                    success: true,
                                    message: 'Password updated successfully.',
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Validation failed or bad request.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Validation failed',
                                    errors: [
                                        { msg: 'New password is required.', param: 'newPassword', location: 'body' },
                                    ],
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized - Invalid or expired token.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Invalid or expired token.',
                                },
                            },
                        },
                    },
                    404: {
                        description: 'User not found.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'User not found.',
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Server error.',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Internal Server Error',
                                    error: 'An unknown error occurred.',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    tags: [
        {
            name: 'User Auth',
            description: 'This Section For User Auth Like Sign Up, Sign In, OTP Validation, Forgot Password ',
        },
    ],
};

export default userAuthSwagger;
