const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const {
    swaggerUi,
    specs
} = require('./swagger');
const authRoutes = require('./src/routes/auth.route');
const tasksRoutes = require('./src/routes/tasks.route');
const env = process.env.NODE_ENV || "development";
const config = require('./config/config')[env];
const {
    PORT
} = config;
const sequelize = require('./config/dbConfig');
const GeneralUserError = require('./src/errors/GeneralUserError');
const NotFoundError = require('./src/errors/NotFoundError');
const UserRegisterationError = require('./src/errors/UserRegisterationError');
const UnauthorizedError = require('./src/errors/UnauthorizedError');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);

// Swagger Documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


app.use((err, req, res, next) => {
    let message = err.message || 'Internal Server Error';
    let statusCode = 500;
    let success = false;
    let body = err.body;
    if (err instanceof GeneralUserError) {
        statusCode = 400;
        if (err instanceof NotFoundError) {
            statusCode = 404;
        }
        if (err instanceof UserRegisterationError) {
            statusCode = 409;
        }
        if (err instanceof UnauthorizedError) {
            statusCode = 401;
        }
    }
    console.log(err);
    let resObj = {
        message,
        success
    };
    if (body) {
        resObj = {
            ...body,
            ...resObj
        }
    }
    return res.status(statusCode).json(resObj);
});

// Connection to DB and Starting server
sequelize.authenticate().then(async () => {
    console.log('Connection has been established successfully.');
    await sequelize.sync({
        // force: true
    });
    return app.listen(PORT);
}).then(() => {
    console.log(`Server is running on port ${PORT}`);
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = app;