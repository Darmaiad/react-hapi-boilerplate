const ENV = process.env.NODE_ENV.toUpperCase();

module.exports = {
    port: parseInt(process.env[`${ENV}_PORT`], 10) || 9000,
    host: process.env[`${ENV}_HOST`] || 'localhost',
};
