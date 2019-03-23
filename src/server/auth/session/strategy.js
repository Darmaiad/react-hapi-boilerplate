import sessionValidation from './validation';

const sessionStrategy = (server) => ({
    cookie: {
        name: 'sid-example',
        isSecure: false,
        password: 'KwGv0d828tkWEhI9WOGLg1pqHFXIs3Q4ENAJsnHjgEYgDYzZ', // Generated at random
    },
    // redirectTo: false,
    redirectTo: '/login',
    validateFunc: sessionValidation(server.app.cache),
});

export default sessionStrategy;
