const env = process.env.NODE_ENV || "development";
const config = require('../../config/config')[env];
const UserService = require("../services/User.service");

class UserUtil {
    /**
     * @param {String} username
     * @param {UserService} userService 
     */
    async generateUniqueSuggestions(username, userService) {
        const suggestions = [];
        do {
            const suggestedUsername = this.generateSuggestion(username);
            const isRegistered = await userService.isRegistered({
                username: suggestedUsername
            });

            if (!isRegistered) {
                suggestions.push(suggestedUsername);
            }
        } while (suggestions.length < config.USERNAME_SUGGESTIONS);

        return suggestions;
    }
    /**
     * @param {Object} where
     * @param {UserService} userService 
     */
    async isRegistered(where, userService) {
        where = {
            deleted: false,
            ...where
        }
        const user = await userService.getUser(where);
        return !!user;
    }

    generateSuggestion(username) {
        const usernameWithoutNumbers = username.replace(/\d+/g, '');

        const randomSuffix = Math.floor(Math.random() * 1000);
        const randomChars = this.generateRandomCharacters(3);

        return `${usernameWithoutNumbers}_${randomChars}${randomSuffix}`;
    }

    generateRandomCharacters(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }
        return randomString;
    }

}

module.exports = UserUtil;