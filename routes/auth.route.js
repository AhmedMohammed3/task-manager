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

router.post('/check-username', (req, res, next) => authController.checkUserName(req, res, next));
router.post('/check-email', (req, res, next) => authController.checkEmail(req, res, next));
router.post('/register', (req, res, next) => authController.registerUser(req, res, next));
router.post('/login', (req, res, next) => authController.loginUser(req, res, next));

module.exports = router;