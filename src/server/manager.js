const { generate, genericGet, genericPost, logout, login } = require('./handlers');

const manager = {
  generate: async (request, h) => generate(request, h),
  logout: async (request, h) => logout(request, h),
  genericGet: async (request, h) => genericGet(request, h),
  genericPost: async (request, h) => genericPost(request, h),
  login: async (request, h) => login(request, h),
};

module.exports = manager;
