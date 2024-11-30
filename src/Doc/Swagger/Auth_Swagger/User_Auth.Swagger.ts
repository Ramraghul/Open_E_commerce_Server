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
    },    
    tags: [
        {
            name: 'User Auth',
            description: 'This Section For User Auth Like Sign Up, Sign In, OTP Validation, Forgot Password ',
        },
    ],
};

export default userAuthSwagger;
