const env = process.env.NODE_ENV || "development";
const config = require('../../config/config')[env];
const UserService = require("../services/User.service");
const {
    generateFromEmail: generateUsername
} = require("unique-username-generator");

class UserUtil {
    /**
     * @param {String} username
     * @param {UserService} userService 
     */
    async generateUniqueSuggestions(username, userService) {
        const suggestions = [];
        do {
            // const suggestedUsername = this.generateSuggestion(username);
            const suggestedUsername = generateUsername(username, 3);
            const isRegistered = await this.isRegistered({
                username: suggestedUsername
            }, userService);

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