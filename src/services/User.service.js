const User = require("../models/User");

class UserService {
    /**
     * @param {User} userModel 
     */
    constructor(userModel) {
        this.userModel = userModel;
    }

    async getUserById(userId) {
        const user = await this.userModel.findByPk(userId);
        return user && !user.deleted ? user : null;
    }

    async getUser(where) {
        where = {
            deleted: false,
            ...where
        }
        return await this.userModel.findOne({
            where
        });
    }

    async getAllUsers(where) {
        where = {
            deleted: false,
            ...where
        }
        return await this.userModel.findAll({
            where
        });
    }
    async createUser(userData) {
        return await this.userModel.create(userData);
    }

    async updateUsers(where, userData) {
        where = {
            deleted: false,
            ...where
        }
        const [updatedRowsCount, updatedUsers] = await this.userModel.update(userData, {
            where
        });
        return {
            updatedRowsCount,
            updatedUsers
        };
    }

    async updateUserById(userId, userData) {
        const {
            updatedRowsCount,
            updatedUsers
        } = await this.updateUsers({
            id: userId
        }, userData);
        return {
            updatedRowsCount,
            updatedUser: updatedUsers && updatedUsers.length > 0 ? updatedUsers[0] : undefined
        };
    }

    async deleteUser(userId) {
        const {
            updatedRowsCount
        } = await this.updateUserById(userId, {
            deleted: true
        });
        return updatedRowsCount > 0;
    }

}

module.exports = UserService;