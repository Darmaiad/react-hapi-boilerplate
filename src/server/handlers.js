import axios from 'axios';
import JWT from 'jsonwebtoken'; // Used to sign our content
import v4 from 'uuid';

import db from './db';

import config from '../../config';

// Site that can simulate third party APIs
const url = 'https://jsonplaceholder.typicode.com/posts/1';

const getData = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

// use the token as the 'authorization' header in requests
const privateKey = 'ZNlTx2fMYGOMRdr86FF3N613fF2sxBSmTg3RBNnoxpeHBVPH';

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
                account = db[request.payload.username];
                if (!account || account.password !== request.payload.password) {
                    message = 'Invalid username or password';
                }
            }
        }

        if (request.method === 'get' || message) {
            return h.response(`<html><head><title>Login page</title></head><body>${ 
            message ? '<h3>' + message + '</h3><br/>' : '' 
            }<form method="post" action="/login">` +
            `Username: <input type="text" name="username"><br>` +
            `Password: <input type="password" name="password"><br/>` +
            `<input type="submit" value="Login"></form></body></html>`);
        }

        const sid = String(v4());

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

    token: async (request, h) => h.response(JWT.sign(db.jo, privateKey)), // JWT sign is synchronous

    getConfiguration: (request, h) => h.response(config),
};

module.exports = handlers;
