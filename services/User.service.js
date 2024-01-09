const NotFoundError = require("../errors/NotFoundError");
const GeneralUserError = require("../errors/GeneralUserError");

class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async getUserById(userId) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new NotFoundError(`User with ID ${userId} not found`);
        }
        return user;
    }

    async addUser(userData) {
        return await this.userModel.create(userData);
    }

    async getAllUsers(where) {
        return await this.userModel.findAll({
            where
        });
    }

    async getUser(where) {
        return await this.userModel.findOne({
            where
        });
    }

    async isRegistered(where) {
        const user = await this.getUser(where);
        return !!user;
    }

    async updateUser(where, userData) {
        const [updatedRowsCount] = await this.userModel.update(userData, {
            where
        });
        if (updatedRowsCount === 0) {
            throw new NotFoundError(`No matching user found for update, ${where}`);
        }
        return updatedRowsCount;
    }

    async updateUserById(userId, userData) {
        const [updatedRowsCount] = await this.userModel.update(userData, {
            where: {
                id: userId
            }
        });
        if (updatedRowsCount === 0) {
            throw new NotFoundError(`User with ID ${userId} not found for update`);
        }
        return updatedRowsCount;
    }
}

module.exports = UserService;