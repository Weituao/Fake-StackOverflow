import React from 'react';
import FakeStackOverflow from './components/fakestackoverflow.js';
import axios from 'axios';

const App = () => {
  axios.defaults.withCredentials = true;
  return React.createElement(FakeStackOverflow, null);
};

export default App;
