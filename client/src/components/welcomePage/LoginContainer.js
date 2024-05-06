import React, {useState} from 'react';
import '../../stylesheets/App.css'
import axios from 'axios';

export default function LogInContainer({updatePage}) {
const [formInputs, setformInputs] = useState({ emailAddress: '', password: '' });
const [hasError, setHasError] = useState({ emailAddress: null, password: null });
const returntoWelcomePage = () => updatePage('welcome');
const directToSignUpPage = () => updatePage('signup');

  function thefc(e) {
    const tybjexfw = e.target.value.trim();
    setformInputs({ ...formInputs, emailAddress: tybjexfw });}
  
  function exwfybuj(e) {
    const tyjerfc = e.target.value.trim();
    setformInputs({ ...formInputs, password: tyjerfc }); }
  
  function rtvwexf(email) {
    const xwtvr = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !xwtvr.test(email); }
  
function tew() {
    let ryfe = formInputs.emailAddress.trim();
    let yurt = formInputs.password.trim();
    const mailer = (ryfe.length === 0) ? 'Email can not be empty' :
                       (rtvwexf(ryfe)) ? 'Invalid email' : null;
    const nogoodpass = (yurt.length === 0) ? 'Password not be empty.' : null;
    const newer = { emailAddress: mailer, password: nogoodpass };
    setHasError(newer);
    const isValid = mailer === null && nogoodpass === null;
    return isValid && axios
        .post('http://localhost:8000/users/logIn', { email: ryfe, password: yurt }, {
            headers: {
                'Content-Type': 'application/json', }, })
        .then(function (res) {
            const newErrorState = { emailAddress: null, password: res.data === 'success' ? null : res.data };
            setHasError(newErrorState);
            if (res.data === 'success') {
                updatePage('guest')}   })
        .catch(function (error) {
            console.error('Login error:', error);
            const newErrorState = { emailAddress: null, password: 'Error, please try again later' };
            setHasError(newErrorState);
            return Promise.reject(error); });}

return React.createElement(React.Fragment, null,
    React.createElement("div", { className: "sulg-container" },
        React.createElement("h1", { style: { fontStyle: 'italic', fontSize: '500%' } }, "Log In"),
        React.createElement("div", { className: "sulg-form" },
            React.createElement("input", { type: "email", placeholder: "Email Address", onChange: thefc, style: { fontStyle: 'italic' } }),
            React.createElement("br", null),
            React.createElement("label", { htmlFor: "email", className: "test-error", id: "f-error" },
                hasError.emailAddress === null ? '' : hasError.emailAddress),
            React.createElement("input", { type: "password", placeholder: "Password", onChange: exwfybuj, style: { fontStyle: 'italic' } }),
            React.createElement("br", null),
            React.createElement("label", { htmlFor: "password", className: "test-error", id: "f-error" },
                hasError.password === null ? '' : hasError.password),
            React.createElement("div", { className: "button-container" },
                React.createElement("button", { onClick: tew }, "Log In"),
                React.createElement("button", { onClick: returntoWelcomePage }, "Back to Welcome Page"),
                React.createElement("button", { onClick: directToSignUpPage }, "Sign Up") ) ),  ));};

