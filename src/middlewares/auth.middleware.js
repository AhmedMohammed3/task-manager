const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

class AuthMiddleware {
    constructor(secretKey) {
        this.secretKey = secretKey;
    }

    createToken(userData) {
        const {
            email,
            username,
            id
        } = userData;

        const token = jwt.sign({
            userEmail: email,
            username,
            userId: id
        }, this.secretKey, {
            expiresIn: '24h',
        });

        return token;
    }

    validateToken(req, res, next) {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            throw new UnauthorizedError('Unauthorized - Missing token');
        }
        const token = authHeader.split(' ')[1].trim() || req.cookies.token;

        if (!token) {
            throw new UnauthorizedError('Unauthorized - Missing token');
        }

        jwt.verify(token, this.secretKey, (err, decoded) => {
            if (err) {
                throw new UnauthorizedError('Unauthorized - Invalid token');
            }
            req.user = decoded;
            return next();
        });
    }
}

module.exports = AuthMiddleware;