const express = require('express');
const AuthController = require("../controllers/auth.controller");
const UserService = require('../services/User.service');
const User = require('../models/User');
const UserUtil = require('../utils/UserUtil');
const AuthMiddleware = require('../middlewares/auth.middleware');

const env = process.env.NODE_ENV || "development";
const config = require('../../config/config')[env];

const userService = new UserService(User);
const userUtil = new UserUtil(userService);
const authMiddleware = new AuthMiddleware(config.JWT_KEY)
const authController = new AuthController(userService, userUtil, authMiddleware, Number(config.PASS_SALT));

const router = express.Router();
/**
 * @swagger
 * /auth/check-username:
 *   post:
 *     description: Check if a username is available and suggest 4 alternatives if not
 *     tags:
 *       - Auth
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
 *       409:
 *         description: User is already registered
 *         content:
 *           application/json:
 *             example:
 *               message: User is Registered
 *               success: false
 *               suggestedUsernames:
 *                 - suggested_username_1
 *                 - suggested_username_2
 *                 - suggested_username_3
 *                 - suggested_username_4
 *       400:
 *         description: User Input Error
 *         content:
 *           application/json:
 *             example:
 *               message: Username is required
 *               success: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               success: false
 */
router.post('/check-username', (req, res, next) => authController.checkUserName(req, res, next));
/**
 * @swagger
 * /auth/check-email:
 *   post:
 *     description: Check if a email is available
 *     tags:
 *       - Auth
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
 *         description: User Input Error
 *         content:
 *           application/json:
 *             example:
 *               message: Email is required
 *               success: false
 *       409:
 *         description: User is already registered
 *         content:
 *           application/json:
 *             example:
 *               message: User is Registered
 *               success: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               success: false
 */
router.post('/check-email', (req, res, next) => authController.checkEmail(req, res, next));
/**
 * @swagger
 * /auth/register:
 *   post:
 *     description: Register a new user
 *     tags:
 *       - Auth
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
 *         description: User Input Error
 *         content:
 *           application/json:
 *             example:
 *               message: Username, email, password, fName, and lName are required for user creation
 *               success: false
 *       409:
 *         description: Duplicate username or email
 *         content:
 *           application/json:
 *             example:
 *               message: User is already Registered
 *               success: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Could not create user
 *               success: false
 */
router.post('/register', (req, res, next) => authController.registerUser(req, res, next));
/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Log in a user
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: username
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
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
 *         description: User Input Error
 *         content:
 *           application/json:
 *             example:
 *               message: Username/email and password are required for user login
 *               success: false
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               message: Provided credentials did not match
 *               success: false
 *       404:
 *         description: User is not registered yet
 *         content:
 *           application/json:
 *             example:
 *               message: User is not registered yet
 *               success: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Could not authenticate user
 *               success: false
 */
router.post('/login', (req, res, next) => authController.loginUser(req, res, next));

module.exports = router;