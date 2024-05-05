import React, { useState, useEffect, useCallback } from 'react';
import '../../stylesheets/WelcomePage.css';
import LoginContainer from './LoginContainer.js';
import SignUpContainer from './SignupContainer.js';
import PageSelector from '../pageSelector/PageSelector.js';
import axios from 'axios';

function WelcomePage() {
  const [testp, getthisp] = useState('welcome');
  const [isac, getisac] = useState({ loggedIn: false, username: '', email: '' });
  const updateSession = useCallback(function(data) {
    getisac(data); }, []);

  useEffect(() => {
    const getcode = async () => {
      try {
        const res = await axios.get('http://localhost:8000/users/session');
        updateSession(res.data);} catch (err) {
        console.log(err);} };
    getcode();}, [updateSession]);
  

  return (
    testp === 'login' ? (
      isac.loggedIn ? (
        React.createElement(PageSelector, {
          currentPage: 'questions',
          welcomePage: getthisp,
          sessionActive: isac,
          updateSession: updateSession
        })
      ) : (
        React.createElement(LoginContainer, { updatePage: getthisp })
      )
    ) : testp === 'signup' ? (
      isac.loggedIn ? (
        React.createElement(PageSelector, {
          currentPage: 'questions',
          welcomePage: getthisp,
          sessionActive: isac,
          updateSession: updateSession
        })
      ) : (
        React.createElement(SignUpContainer, { updatePage: getthisp })
      )
    ) : testp === 'guest' ? (
      React.createElement('div', null,
        React.createElement(PageSelector, {
          currentPage: 'questions',
          welcomePage: getthisp,
          sessionActive: isac,
          updateSession: updateSession
        })
      )
    ) : (
      React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'wp-main-div' }),
        React.createElement('div', { className: 'centered' },
          React.createElement('h1', { className: 'wp-h1' }, 'Fake Stackoverflow'),
          React.createElement('div', { className: 'wp-button-container', style: { display: 'flex', flexDirection: 'column' } },
          React.createElement('button', { disabled: isac.loggedIn, onClick: () => getthisp('signup'), style: { height: '120%', width: '120%' } },
            'Sign Up'
          ),
          React.createElement('button', { disabled: isac.loggedIn, onClick: () => getthisp('login'), style: { height: '120%', width: '120%' } },
            'Log In'
          ),
          React.createElement('button', { onClick: () => getthisp('guest'), style: { height: '120%', width: '120%' } },
            isac.loggedIn ? `Welcome back ${isac.username}` : 'Continue as Guest'
          )
        )
        
        )
      )
    )
  );
}

export default WelcomePage;
