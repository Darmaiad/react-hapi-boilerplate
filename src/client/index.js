import "core-js/stable";
import "regenerator-runtime/runtime";

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import '../assets/main.scss';

render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('AppContainer')); // eslint-disable-line react/jsx-filename-extension

/* eslint func-names: 0 */
/* eslint prefer-arrow-callback: 0 */

if (module.hot) {
    module.hot.accept('./components/Root', function () { // Arrow function will not work
        render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('AppContainer'));
    });
}
