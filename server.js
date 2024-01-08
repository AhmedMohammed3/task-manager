const express = require('express');
const app = express();
const env = process.env.NODE_ENV || "development";
const config = require('./config/config')[env];
const {
    PORT
} = config;

const {
    sequelize
} = require('./models/');

// Middleware
app.use(express.json());

// Routes (to be implemented)

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    return app.listen(PORT);
}).then(() => {
    console.log(`Server is running on port ${PORT}`);
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});