const express = require('express');
const cors = require('cors');
const morgan = require('cors');
const app = express();
const env = process.env.NODE_ENV || "development";
const config = require('./config/config')[env];
const {
    PORT
} = config;

const {
    sequelize
} = require('./config/dbConfig');

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes (to be implemented)


// Connection to DB and Starting server
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    return app.listen(PORT);
}).then(() => {
    console.log(`Server is running on port ${PORT}`);
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});