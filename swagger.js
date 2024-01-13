const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager',
            version: '1.0.0',
            description: 'API documentation for Task Manager App',
        },
    },
    apis: ['./routes/auth.route.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};