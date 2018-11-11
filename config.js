require('dotenv').config();

const ENV = process.env.NODE_ENV.toUpperCase();

console.log(`Running in: ${ENV} environment`);

module.exports = {
  port: parseInt(process.env[`${ENV}_PORT`], 10) || 9000,
};
