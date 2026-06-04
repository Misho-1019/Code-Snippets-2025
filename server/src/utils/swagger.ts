import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Code Snippets API',
            version: '1.0.0',
            description: 'Full-stack code snippet manager API',
        },
        servers: [{ url: process.env.SWAGGER_SERVER_URL || `http://localhost:${process.env.PORT || 3030}` }],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'auth',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                    },
                },
                Snippet: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        code: { type: 'string' },
                        language: { type: 'string' },
                        creator: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        likes: { type: 'array', items: { type: 'string' } },
                    },
                },
                Comment: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        text: { type: 'string' },
                        creator: { type: 'string' },
                        snippetId: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./src/controllers/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
