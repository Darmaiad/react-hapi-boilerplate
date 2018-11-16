import jwtValidation from './validation';

// Generated at random, should be read from a file
const privateKey = 'ZNlTx2fMYGOMRdr86FF3N613fF2sxBSmTg3RBNnoxpeHBVPH';

const jwtStrategy = (server) => ({
  key: privateKey,
  validate: jwtValidation,
  verifyOptions: { algorithms: ['HS256'] },
  ignoreExpiration: false,
});

export default jwtStrategy;
