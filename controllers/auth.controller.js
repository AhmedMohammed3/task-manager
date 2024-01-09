const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

const GeneralUserError = require('../errors/GeneralUserError');
const UserService = require('../services/User.service');
const UserRegisteration = require('../errors/UserRegisteration');
const NotFoundError = require('../errors/NotFoundError');
const AuthMiddleware = require('../middlewares/auth.middleware');

class AuthController {
    /**
     * @param {UserService} userService 
     * @param {AuthMiddleware} authMiddleware
     * @param {Number} passSalt
     */
    constructor(userService, authMiddleware, passSalt) {
        this.userService = userService;
        this.authMiddleware = authMiddleware;
        this.passSalt = passSalt;
    }

    async checkUserName(req, res, next) {
        //TODO: suggest usernames according to the upcoming username
        try {
            const {
                username
            } = req.body;
            if (!username) {
                throw new GeneralUserError("Username is required");
            }
            const registered = await this.userService.isRegistered({
                username
            });
            if (registered) {
                throw new UserRegisteration("User is Registered");
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

    async checkEmail(req, res, next) {
        try {
            const {
                email
            } = req.body;
            if (!email) {
                throw new GeneralUserError("Email is required");
            }
            //TODO: validate email format
            const registered = await this.userService.isRegistered({
                email
            });
            if (registered) {
                throw new UserRegisteration("User is Registered");
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
            const registered = await this.userService.isRegistered({
                [Sequelize.Op.or]: [{
                    username
                }, {
                    email
                }]
            });
            if (registered) {
                throw new UserRegisteration("User already registered");
            }
            const hashedPass = bcrypt.hashSync(password, this.passSalt);
            const created = await this.userService.addUser({
                username,
                email,
                password: hashedPass,
                fName,
                lName
            });
            if (!created) {
                throw new Error("Could not create user!");
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
                throw new NotFoundError("User has not registered yet!");
            }
            const match = bcrypt.compareSync(password, user.password);
            if (!match) {
                throw new GeneralUserError('Provided credentials did not match');
            }

            const token = this.authMiddleware.createToken(user);
            if (!token) {
                throw new Error();
            }
            return res.status(200).json({
                message: "Logged In",
                loggedIn: true,
                token,
                success: true
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = AuthController;