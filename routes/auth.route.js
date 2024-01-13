const express = require('express');
const AuthController = require("../controllers/auth.controller");
const UserService = require('../services/User.service');
const User = require('../models/User');
const AuthMiddleware = require('../middlewares/auth.middleware');

const env = process.env.NODE_ENV || "development";
const config = require('../config/config')[env];

const userService = new UserService(User);
const authMiddleware = new AuthMiddleware(config.JWT_KEY)
const authController = new AuthController(userService, authMiddleware, Number(config.PASS_SALT));

const router = express.Router();
/**
 * @swagger
 * /auth/check-username:
 *   post:
 *     description: Check if a username is available
 *     parameters:
 *       - name: username
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *     responses:
 *       202:
 *         description: User is not registered
 *         content:
 *           application/json:
 *             example:
 *               message: User is not registered
 *               available: true
 *               success: true
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/check-username', (req, res, next) => authController.checkUserName(req, res, next));
/**
 * @swagger
 * /auth/check-email:
 *   post:
 *     description: Check if a email is available
 *     parameters:
 *       - name: email
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       202:
 *         description: User is not registered
 *         content:
 *           application/json:
 *             example:
 *               message: User is not registered
 *               available: true
 *               success: true
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/check-email', (req, res, next) => authController.checkEmail(req, res, next));
/**
 * @swagger
 * /register:
 *   post:
 *     description: Register a new user
 *     parameters:
 *       - name: username
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *       - name: email
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *       - name: password
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             password:
 *               type: string
 *       - name: fName
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             fName:
 *               type: string
 *       - name: lName
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             lName:
 *               type: string
 *     responses:
 *       201:
 *         description: User has been created
 *         content:
 *           application/json:
 *             example:
 *               message: User has been created
 *               success: true
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/register', (req, res, next) => authController.registerUser(req, res, next));
/**
 * @swagger
 * /login:
 *   post:
 *     description: Log in a user
 *     parameters:
 *       - name: username
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *       - name: email
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *       - name: password
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Logged In
 *         content:
 *           application/json:
 *             example:
 *               message: Logged In
 *               loggedIn: true
 *               token: "your_generated_token"
 *               success: true
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Invalid credentials
 *       404:
 *         description: User has not registered yet
 *       500:
 *         description: Internal server error
 */
router.post('/login', (req, res, next) => authController.loginUser(req, res, next));

module.exports = router;