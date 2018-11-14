const axios = require('axios');

let uuid = 1; // Replace it with v4 or something

const users = {
  jo: {
    id: 'jo',
    password: 'pass',
    name: 'jo Doe',
  },
};

// Site that cal simulate third party APIs
const url = 'https://jsonplaceholder.typicode.com/posts/1';

const getData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const handlers = {
  generate: async (request, h) => h.response({ crumb: request.plugins.crumb }),

  login: async (request, h) => {
    if (request.auth.isAuthenticated) {
      return h.redirect('/');
    }

    let message = '';
    let account = null;

    if (request.method === 'post') {
      if (!request.payload.username || !request.payload.password) {
        message = 'Missing username or password';
      } else {
        account = users[request.payload.username];
        if (!account || account.password !== request.payload.password) {
          message = 'Invalid username or password';
        }
      }
    }

    // if (request.method === 'get') {
    //   return 'Login to access this API';
    // }

    // if (message) {
    //   return `message: ${message}`;
    // }

    if (request.method === 'get' ||
        message) {

        return '<html><head><title>Login page</title></head><body>' +
            (message ? '<h3>' + message + '</h3><br/>' : '') +
            '<form method="post" action="/login">' +
            'Username: <input type="text" name="username"><br>' +
            'Password: <input type="password" name="password"><br/>' +
            '<input type="submit" value="Login"></form></body></html>';
    }

    const sid = String(uuid += 1);

    await request.server.app.cache.set(sid, { account }, 0);
    request.cookieAuth.set({ sid });

    return h.redirect('/');
  },

  logout: async (request, h) => {
    request.server.app.cache.drop(request.state['sid-example'].sid);
    request.cookieAuth.clear();
    return h.response('You have been logged out');
    // return h.redirect('/');
  },

  genericGet: async (request, h) => h.response(await getData(url)),

  genericPost: async (request, h) => h.response('Generic POST reply'),
};

module.exports = handlers;
