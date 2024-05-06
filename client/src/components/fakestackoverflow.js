import React from 'react';
import WelcomePage from './welcomePage/WelcomePage.js';

class FakeStackOverflow extends React.Component {
  render() {
    return React.createElement('div', null, React.createElement(WelcomePage, null));}}
export default FakeStackOverflow;
