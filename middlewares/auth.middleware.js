const jwt = require('jsonwebtoken');

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
            email,
            username,
            id
        }, this.secretKey, {
            expiresIn: '24h',
        });

        return token;
    }

    validateToken(req, res, next) {
        const authHeader = req.header('Authorization');
        const token = authHeader.split(' ')[1].trim() || req.cookies.token;

        if (!token) {
            throw new UnauthorizedError('Unauthorized - Missing token');
        }

        jwt.verify(token, this.secretKey, (err, decoded) => {
            if (err) {
                throw new UnauthorizedError('Unauthorized - Invalid token');
            }
            req.user = decoded;
            next();
        });
    }
}

module.exports = AuthMiddleware;