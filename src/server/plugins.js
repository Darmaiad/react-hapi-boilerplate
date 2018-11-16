import Inert from 'inert';
import Vision from 'vision';
import HapiSwagger from 'hapi-swagger';
import HapiAuthCookie from 'hapi-auth-cookie';
import Crumb from 'crumb';
import HapiAuthJwt2 from 'hapi-auth-jwt2';

const plugins = [
  Inert, // Serving of static content
  Vision, // Needed for swagger
  HapiAuthCookie,
  HapiAuthJwt2,
  {
    plugin: HapiSwagger,
    options: {
      info: {
        title: 'Test API Documentation',
        version: '0.0.3',
      },
    },
  }, { // Protection againt CSRF attacks
    plugin: Crumb,
    options: {
      restful: true,
      cookieOptions: {
        isSecure: false,
      },
    },
  },
];

export default plugins;
