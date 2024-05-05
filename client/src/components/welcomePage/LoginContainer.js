import React, {useState} from 'react';
import '../../stylesheets/SignUpANDLogInContainer.css'
import axios from 'axios';

function LogInContainer({updatePage}) {

const [formInputs, setformInputs] = useState({ emailAddress: '', password: '' });
const [hasError, setHasError] = useState({ emailAddress: null, password: null });

const returntoWelcomePage = () => updatePage('welcome');

const directToSignUpPage = () => updatePage('signup');


  function setEmailAddress(e) {
    const emailAddress = e.target.value.trim();
    setformInputs({ ...formInputs, emailAddress });
  }
  
  function setPassword(e) {
    const password = e.target.value.trim();
    setformInputs({ ...formInputs, password });
  }
  
  function isNotValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !pattern.test(email);
  }
  


function validateLogin() {
    let email = formInputs.emailAddress.trim();
    let password = formInputs.password.trim();
    const emailError = (email.length === 0) ? 'Email field can not be empty.' :
                       (isNotValidEmail(email)) ? 'Invalid email address provided.' : null;
    const passwordError = (password.length === 0) ? 'Password field can not be empty.' : null;
    const newStateHasError = { emailAddress: emailError, password: passwordError };
    setHasError(newStateHasError);
    const isValid = emailError === null && passwordError === null;
    return isValid && axios
        .post('http://localhost:8000/users/logIn', { email, password }, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(function (res) {
            const newErrorState = { emailAddress: null, password: res.data === 'success' ? null : res.data };
            setHasError(newErrorState);
            if (res.data === 'success') {
                updatePage('guest');
            }
        })
        .catch(function (error) {
            console.error('Login error:', error);
            const newErrorState = { emailAddress: null, password: 'An error occurred while logging in. Please try again.' };
            setHasError(newErrorState);
            return Promise.reject(error);
        });
}

    
return React.createElement(React.Fragment, null,
    React.createElement("div", { className: "sulg-container" },
        React.createElement("h1", { style: { fontStyle: 'italic', fontSize: '500%' } }, "Log In"),
        React.createElement("div", { className: "sulg-form" },
            React.createElement("input", { type: "email", placeholder: "Email Address", onChange: setEmailAddress, style: { fontStyle: 'italic' } }),
            React.createElement("br", null),
            React.createElement("label", { htmlFor: "email", className: "new-f-error", id: "f-error" },
                hasError.emailAddress === null ? '' : hasError.emailAddress),
            React.createElement("input", { type: "password", placeholder: "Password", onChange: setPassword, style: { fontStyle: 'italic' } }),
            React.createElement("br", null),
            React.createElement("label", { htmlFor: "password", className: "new-f-error", id: "f-error" },
                hasError.password === null ? '' : hasError.password),
            React.createElement("div", { className: "button-container" },
                React.createElement("button", { onClick: validateLogin }, "Log In"),
                React.createElement("button", { onClick: returntoWelcomePage }, "Back to Welcome Page"),
                React.createElement("button", { onClick: directToSignUpPage }, "Sign Up")
            )
        ),
    )
);



};

export default LogInContainer;
