const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

const GeneralUserError = require('../errors/GeneralUserError');
const UserService = require('../services/User.service');
const UserRegisterationError = require('../errors/UserRegisterationError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const AuthMiddleware = require('../middlewares/auth.middleware');
const UserUtil = require('../utils/UserUtil');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class AuthController {
    /**
     * @param {UserService} userService 
     * @param {UserUtil} userUtil
     * @param {AuthMiddleware} authMiddleware
     * @param {Number} passSalt
     */
    constructor(userService, userUtil, authMiddleware, passSalt) {
        this.userService = userService;
        this.userUtil = userUtil;
        this.authMiddleware = authMiddleware;
        this.passSalt = passSalt;
    }

    async checkUserName(req, res, next) {
        try {
            const {
                username
            } = req.body;
            if (!username) {
                throw new GeneralUserError("Username is required");
            }
            const registered = await this.userUtil.isRegistered({
                username
            }, this.userService);
            if (registered) {
                const suggestedUsernames = await this.userUtil.generateUniqueSuggestions(username, this.userService);
                throw new UserRegisterationError("User is already registered", {
                    suggestedUsernames
                });
            }
            return res.status(202).json({
                message: "User is not registered",
                available: true,
                success: true
            });

        } catch (err) {
            next(err);
        }
    }

    async checkEmail(req, res, next) {
        try {
            const {
                email
            } = req.body;
            if (!email) {
                throw new GeneralUserError("Email is required");
            }
            if (!emailRegex.test(email)) {
                throw new GeneralUserError("Invalid email format");
            }
            const registered = await this.userUtil.isRegistered({
                email
            }, this.userService);
            if (registered) {
                throw new UserRegisterationError("User is Registered");
            }
            return res.status(202).json({
                "message": "User is not registered",
                available: true,
                success: true
            });
        } catch (err) {
            next(err);
        }
    }

    async registerUser(req, res, next) {
        try {
            const {
                username,
                email,
                password,
                fName,
                lName
            } = req.body;
            if (!username || !email || !password || !fName || !lName) {
                throw new GeneralUserError('Username, email, password, fName, and lName are required for user creation');
            }
            if (!emailRegex.test(email)) {
                throw new GeneralUserError("Invalid email format");
            }
            const registered = await this.userUtil.isRegistered({
                [Sequelize.Op.or]: [{
                    username
                }, {
                    email
                }]
            }, this.userService);
            if (registered) {
                throw new UserRegisterationError("User is already registered");
            }
            const hashedPass = bcrypt.hashSync(password, this.passSalt);
            const created = await this.userService.createUser({
                username,
                email,
                password: hashedPass,
                fName,
                lName
            });
            if (!created) {
                throw new Error("Could not create user");
            }
            return res.status(201).json({
                message: "User has been created",
                success: true
            });

        } catch (err) {
            next(err);
        }
    }

    async loginUser(req, res, next) {
        try {
            const {
                username,
                password,
            } = req.body;
            if ((!username && !email) || !password) {
                throw new GeneralUserError('Username/email and password are required for user login');
            }
            const user = await this.userService.getUser({
                [Sequelize.Op.or]: [{
                    username
                }, {
                    email: username
                }]
            });
            if (!user) {
                throw new NotFoundError("User is not registered yet");
            }
            const match = bcrypt.compareSync(password, user.password);
            if (!match) {
                throw new UnauthorizedError('Provided credentials did not match');
            }

            const token = this.authMiddleware.createToken(user);
            if (!token) {
                throw new Error("Could not authenticate user");
            }
            return res.status(200).json({
                message: "Logged In",
                success: true,
                token
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = AuthController;