const Hapi = require('hapi');
const Joi = require('joi');

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {

    return 'Hello, world!';
  },
});

server.route({
  method: 'GET',
  path: '/{name}',
  options: {
    validate: {
      params: {
        name: Joi.string().min(3).max(10),
      },
    },
  },
  handler: (request, h) => `Hello, ${encodeURIComponent(request.params.name)}`,
});

const init = async () => {

  await server.register(require('inert'));

  server.route({
    method: 'GET',
    path: '/hello',
    handler: (request, h) => {

      return h.file('./src/index.js');
    },
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();
