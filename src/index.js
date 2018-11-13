import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import Root from './components/Root';

render(<Root />, document.getElementById('AppContainer')); // eslint-disable-line react/jsx-filename-extension

/* eslint func-names: 0 */
/* eslint prefer-arrow-callback: 0 */

if (module.hot) {
  module.hot.accept('./components/Root', function () { // Arrow function will not work
    render(<Root />, document.getElementById('AppContainer'));
  });
}
