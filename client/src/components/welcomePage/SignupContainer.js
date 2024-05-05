import React, { useState } from 'react';
import '../../stylesheets/SignUpANDLogInContainer.css';
import axios from 'axios';

function SignUpContainer({ updatePage: changep }) {
  const [userp, useri] = useState({ userName: '', emailAddress: '', password: '', confirmPassword: '' });
  const [iser, iseer] = useState({
    userName: null,
    emailAddress: null,
    password: null,
    confirmPassword: null,
  });
  
  const getf = function(isfs, number) {
    useri(Object.assign({}, userp, { [isfs]: number.trim() }));
  };
  
  function notgood(email) {
    const issize = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !issize.test(email);
  }
  
  function validateSignUp() {
    const itiswrong = {
      userName: userp.userName.length === 0 ? 'Cannot have empty username' : null,
      emailAddress: userp.emailAddress.length === 0 ? 'Cannot have empty email' : notgood(userp.emailAddress) ? 'Not valid email' : null,
      password: userp.password.length === 0 ? 'Cannot have empty password' : userp.emailAddress.includes(userp.password) || userp.userName.includes(userp.password) ? 'Password cannot contain email or password' : null,
      confirmPassword: userp.confirmPassword.length === 0 ? 'Cannot have empty confirmed password' : userp.confirmPassword !== userp.password ? 'Does not match with the first password' : null,
    };
  
    iseer(itiswrong);
    const good = Object.values(itiswrong).every(error => error === null);
    good && axios
      .post('http://localhost:8000/users/signUp', {
        username: userp.userName,
        email: userp.emailAddress,
        password: userp.password,
        isAdmin: false,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        iseer(prevState => ({ ...prevState, confirmPassword: res.data === 'success' ? null : res.data }));
        res.data === 'success' && changep('login');
      });
  }
  function gobackhome() {
    changep('welcome');
  }
  function gotologin() {
    changep('login');
  }
  
  return React.createElement(React.Fragment, null,
    React.createElement("div", { className: "sulg-container" },
      React.createElement("h1", { style: { fontSize: '400%', fontStyle: 'italic' } }, "Sign Up"),
      React.createElement("div", { className: "sulg-form" },
        React.createElement("input", { type: "text", placeholder: "Username", onChange: function (e) { return getf('userName', e.target.value); }, maxLength: "100", style: { fontStyle: 'italic' } }),
        React.createElement("br", null),
        React.createElement("label", { htmlFor: "username", className: "new-f-error", id: "f-error", style: { fontStyle: 'italic' } },
          iser.userName ? iser.userName : ''),
        React.createElement("input", { type: "email", placeholder: "Email Address", onChange: function (e) { return getf('emailAddress', e.target.value); }, style: { fontStyle: 'italic' } }),
        React.createElement("br", null),
        React.createElement("label", { htmlFor: "email", className: "new-f-error", id: "f-error", style: { fontStyle: 'italic' } },
          iser.emailAddress ? iser.emailAddress : ''),
        React.createElement("input", { type: "password", placeholder: "Password", onChange: function (e) { return getf('password', e.target.value); }, style: { fontStyle: 'italic' } }),
        React.createElement("br", null),
        React.createElement("label", { htmlFor: "password", className: "new-f-error", id: "f-error", style: { fontStyle: 'italic' } },
          iser.password ? iser.password : ''),
        React.createElement("input", { type: "password", placeholder: "Confirm Password", onChange: function (e) { return getf('confirmPassword', e.target.value); }, style: { fontStyle: 'italic' } }),
        React.createElement("br", null),
        React.createElement("label", { htmlFor: "confirmPassword", className: "new-f-error", id: "f-error", style: { fontStyle: 'italic' } },
          iser.confirmPassword ? iser.confirmPassword : ''),
        React.createElement("div", { className: "button-container" },
          React.createElement("button", { onClick: validateSignUp, style: { width: '180%' } }, "Sign Up"),
          React.createElement("button", { onClick: gobackhome, style: { width: '400%' } }, "Welcome Page"),
          React.createElement("button", { onClick: gotologin, style: { width: '140%' } }, "Log In")
        )
      )
    )
  );
  
  

}

export default SignUpContainer;
