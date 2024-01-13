const UserService = require("../services/User.service");

class UserUtil {
    /**
     * 
     * @param {UserService} userService 
     */
    constructor(userService) {
        this.userService = userService;
    }
    async generateUniqueSuggestions(username) {
        const suggestions = [];
        do {
            const suggestedUsername = this.generateSuggestion(username);
            const isRegistered = await this.userService.isRegistered({
                username: suggestedUsername
            });

            if (!isRegistered) {
                suggestions.push(suggestedUsername);
            }
        } while (suggestions.length < 4);

        return suggestions;
    }

    generateSuggestion(username) {
        const usernameWithoutNumbers = username.replace(/\d+/g, '');
    
        const randomSuffix = Math.floor(Math.random() * 1000); // Random number between 0 and 999
        const randomChars = this.generateRandomCharacters(3); // Generate 3 random characters

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