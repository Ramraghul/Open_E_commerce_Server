const BaseUrlVersion = "api/v1";

const userTypeSwagger = {
    paths: {
        [`/${BaseUrlVersion}/user_type/newUserType`]: {
            post: {
                tags: ['User Type'],
                summary: 'Add New User Type',
                description: 'Create a new user type in the system.',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        example: 'admin',
                                        description: 'Name of the new user type (e.g. admin, user, manager, etc.)',
                                    },
                                },
                                required: ['name'],
                            },
                            example: {
                                name: 'admin',
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'User type created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'New user type created successfully.' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                _id: { type: 'string', example: '60d1be054f8e5c001f1a10f5' },
                                                name: { type: 'string', example: 'admin' },
                                                createdAt: { type: 'string', example: '2023-06-23T08:52:45.307Z' },
                                                updatedAt: { type: 'string', example: '2023-06-23T08:52:45.307Z' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Bad Request - Validation errors',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Invalid input: "name" is required and must be a string.',
                                },
                            },
                        },
                    },
                    '409': {
                        description: 'Conflict - User type already exists',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'User type "admin" already exists.',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Server Error',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Internal Server Error',
                                },
                            },
                        },
                    },
                },
            },
        },
        [`/${BaseUrlVersion}/user_type/getAllUserTypes`]: {
            get: {
                tags: ['User Type'],
                summary: 'Get All User Types',
                description: 'Fetch all user types from the system.',
                responses: {
                    '200': {
                        description: 'User types fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'User Types Found.' },
                                        data: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    _id: { type: 'string', example: '6747d10e36948d9a4833b0c1' },
                                                    name: { type: 'string', example: 'Buyer' },
                                                    createdAt: { type: 'string', example: '2024-11-28T02:10:22.444Z' },
                                                    updatedAt: { type: 'string', example: '2024-11-28T02:10:22.444Z' },
                                                },
                                            },
                                        },
                                    },
                                },
                                example: {
                                    success: true,
                                    message: 'User Types Found.',
                                    data: [
                                        {
                                            _id: '6747d10e36948d9a4833b0c1',
                                            name: 'Buyer',
                                            createdAt: '2024-11-28T02:10:22.444Z',
                                            updatedAt: '2024-11-28T02:10:22.444Z',
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'No User Types Found',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'No User Type Found.',
                                    data: [],
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal Server Error',
                        content: {
                            'application/json': {
                                example: {
                                    success: false,
                                    message: 'Internal Server Error',
                                    error: 'Detailed error message',
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
            name: 'User Type',
            description: 'Manage user types in the system (CRUD operations).',
        },
    ],
};

export default userTypeSwagger;
