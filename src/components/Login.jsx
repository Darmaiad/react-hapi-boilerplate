import React from 'react';

const Login = ({ message }) => {
    return (
        <html>
            <head><title>Login page</title></head>
            <body> 
                { message ? `<h3> ${message} </h3><br/>` : '' }
                <form method="post" action="/login">
                Username: <input type="text" name="username" /><br />
                Password: <input type="password" name="password" /><br/>
                    <input type="submit" value="Login" />
                </form>
            </body>
        </html>
    );
};

export default Login;
