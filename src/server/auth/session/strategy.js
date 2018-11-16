import sessionValidation from './validation';

const sessionStrategy = (server) => ({
  password: 'KwGv0d828tkWEhI9WOGLg1pqHFXIs3Q4ENAJsnHjgEYgDYzZ', // Generated at random
  cookie: 'sid-example',
  // redirectTo: false,
  redirectTo: '/login',
  isSecure: false,
  validateFunc: sessionValidation(server.app.cache),
});

export default sessionStrategy;
