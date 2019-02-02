const { generate, genericGet, genericPost, logout, login, token, getConfiguration } = require('./handlers');

const manager = {
    generate: async (request, h) => {
        try {
            return await generate(request, h);
        } catch (error) {
            return error;
        }
    },

    logout: async (request, h) => {
        try {
            return await logout(request, h);
        } catch (error) {
            return error;
        }
    },

    genericGet: async (request, h) => {
        try {
            return await genericGet(request, h);
        } catch (error) {
            return error;
        }
    },

    genericPost: async (request, h) => {
        try {
            return await genericPost(request, h);
        } catch (error) {
            return error;
        }
    },

    login: async (request, h) => {
        try {
            return await login(request, h);
        } catch (error) {
            return error;
        }
    },

    token: async (request, h) => {
        try {
            return await token(request, h);
        } catch (error) {
            return error;
        }
    },

    getConfiguration: async (request, h) => {
        try {
            return await getConfiguration(request, h);
        } catch (error) {
            return error;
        }
    },
};

module.exports = manager;
