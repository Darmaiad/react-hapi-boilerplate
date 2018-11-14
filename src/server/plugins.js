import Inert from 'inert';
import Vision from 'vision';
import HapiSwagger from 'hapi-swagger';
import HapiAuthCookie from 'hapi-auth-cookie';
import Crumb from 'crumb';

const plugins = [
  Inert,
  Vision, // Needed for swagger
  HapiAuthCookie,
  {
    plugin: HapiSwagger,
    options: {
      info: {
        title: 'Test API Documentation',
        version: '0.0.3',
      },
    },
  }, {
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
