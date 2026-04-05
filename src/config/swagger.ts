import swaggerJsdoc from 'swagger-jsdoc';

    const options: swaggerJsdoc.Options = 

        {
        definition: 
        {
            openapi: '3.0.0',
            info: {
            title: 'Impextech API Documentation',
            version: '1.0.0',
            description: 'The official backend API for the Impextech e-commerce platform',
            },
                servers: 
                    [
                        {
                            url: 'http://localhost:3000', // Your local dev server URL
                            description: 'Development server',
                        },
                    ],
                },

            // This tells Swagger where to look for those @route comments!
            apis: ['./src/routes/*.ts', './src/controllers/*.ts'], 
        };


        export const specs = swaggerJsdoc(options);
