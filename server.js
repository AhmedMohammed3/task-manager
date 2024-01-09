const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.route');

const app = express();
const env = process.env.NODE_ENV || "development";
const config = require('./config/config')[env];
const {
    PORT
} = config;

const sequelize = require('./config/dbConfig');
const GeneralUserError = require('./errors/GeneralUserError');
const NotFoundError = require('./errors/NotFoundError');
const UserRegisteration = require('./errors/UserRegisteration');
const UnauthorizedError = require('./errors/UnauthorizedError');

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes (to be implemented)
app.use('/auth', authRoutes);


app.use((err, req, res, next) => {
    let error = 'Internal Server Error';
    let statusCode = 500;
    let success = false;
    if (err instanceof GeneralUserError) {
        statusCode = 400;
        if (err instanceof NotFoundError) {
            statusCode = 404;
        }
        if (err instanceof UserRegisteration) {
            statusCode = 409;
        }
        if (err instanceof UnauthorizedError) {
            statusCode = 401;
        }
        error = err.message;
    }
    console.log(err);
    return res.status(statusCode).json({
        error,
        success
    });
});

// Connection to DB and Starting server
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    // sequelize.sync({
    //     force: true
    // });
    return app.listen(PORT);
}).then(() => {
    console.log(`Server is running on port ${PORT}`);
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});