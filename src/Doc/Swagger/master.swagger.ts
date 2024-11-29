require('dotenv').config();
const BaseUrlVersion = "api/v1";
import swaggerJsdoc from 'swagger-jsdoc';
import userAuthSwagger from './Auth_Swagger/User_Auth.Swagger';
import romanNumeralSwagger from './Auth_Swagger/romanNumeral.swagger';
import userTypeSwagger from './User_Swagger/User_Type.swagger';


// Swagger Definition
const swaggerDefinition = {
    openapi: '3.1.0',
    info: {
        title: 'E-commerce Application Server',
        version: '1.0.0',
        description: `
            This server is the backend for an E-commerce Application. 
            It provides APIs to manage the entire lifecycle of online shopping, including browsing products, 
            adding items to the cart, placing orders, processing payments, tracking shipments, 
            and managing user accounts. This API is designed for developers to create robust and scalable 
            e-commerce platforms with customizable features.`,
        termsOfService: 'https://github.com/Ramraghul/Open_E_commerce_Server',
        contact: {
            name: 'Raghul',
            url: 'https://raghul-test.netlify.app',
            email: 'raghulraghul111@gmail.com',
        },
        license: {
            name: 'MIT License',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT}`,
            description: 'Development Server',
        },
        {
            url: 'https://openecommerceserver.vercel.app',
            description: 'Production Server',
        },
    ],
    security: [
        {
            ApiKeyAuth: [],
        },
    ],
    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
            },
        },
    },
    paths: {
        [`/${BaseUrlVersion}`]: {
            get: {
                tags: ['Route Test'],
                summary: 'Check if the GET method is working',
                description: 'This API is used to check if the GET method is working or not',
                responses: {
                    '200': {
                        description: 'This JavaScript Data Structures And Algorithms API is successfully working',
                        content: {
                            'application/json': {
                                example: {
                                    status: 'true',
                                    message: 'Welcome to the API version 1!'
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Server Side Issue',
                        content: {
                            'application/json': {
                                example: {
                                    status: 'false',
                                    message: 'Internal Server Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        ...userAuthSwagger.paths,
        ...userTypeSwagger.paths,
        ...romanNumeralSwagger.paths,
    },
    tags: [
        //Testing Tag
        {
            name: 'Route Test',
            description: 'Testing For Route Working or not'
        },
        //APIs List
        ...(userAuthSwagger.tags || []),
        ...(userTypeSwagger.tags || []),
        ...(romanNumeralSwagger.tags || []),
    ],
    apis: [
        '../../Routes/master.route'
    ]
};

// Swagger Options
const options = {
    swaggerDefinition,
    apis: [
        '../../Routes/master.route'
    ],
};

// Generate the Swagger Documentation using swagger-jsdoc
export const masterSwagger = swaggerJsdoc(options);

export default masterSwagger;
