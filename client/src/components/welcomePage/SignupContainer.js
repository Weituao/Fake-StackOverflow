import React, { useState } from 'react';
import '../../stylesheets/SignUpANDLogInContainer.css';
import axios from 'axios';

function SignUpContainer({ updatePage }) {
  const [formInputs, setformInputs] = useState({ userName: '', emailAddress: '', password: '', confirmPassword: '' });
  const [hasError, setHasError] = useState({
    userName: null,
    emailAddress: null,
    password: null,
    confirmPassword: null,
  });

  const setField = (fieldName, value) => {
    setformInputs({ ...formInputs, [fieldName]: value.trim() });
  };

  const isNotValidEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !pattern.test(email);
  };

  const validateSignUp = () => {
    const newStateHasError = {
      userName: formInputs.userName.length === 0 ? 'Username field can not be empty.' : null,
      emailAddress: formInputs.emailAddress.length === 0 ? 'Email field can not be empty.' : isNotValidEmail(formInputs.emailAddress) ? 'Invalid email address provided.' : null,
      password: formInputs.password.length === 0 ? 'Password field can not be empty.' : formInputs.emailAddress.includes(formInputs.password) || formInputs.userName.includes(formInputs.password) ? 'Password field can not contain any part of email address or username.' : null,
      confirmPassword: formInputs.confirmPassword.length === 0 ? 'Confirm Password field can not be empty.' : formInputs.confirmPassword !== formInputs.password ? 'Input provided does not match the password above.' : null,
    };

    setHasError(newStateHasError);

    const isValid = Object.values(newStateHasError).every(error => error === null);

    if (isValid) {
      const newUser = {
        username: formInputs.userName,
        email: formInputs.emailAddress,
        password: formInputs.password,
        isAdmin: false,
      };

      axios
        .post('http://localhost:8000/users/signUp', newUser, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          setHasError(prevState => ({ ...prevState, confirmPassword: res.data === 'success' ? null : res.data }));
          if (res.data === 'success') {
            updatePage('login');
          }
        });
    }
  };

  const returntoWelcomePage = () => {
    updatePage('welcome');
  };

  const directToLoginPage = () => {
    updatePage('login');
  };

  return (
    <>
      <div className="sulg-container">
        <h1>Sign Up</h1>
        <div className="sulg-form">
          <input type="text" placeholder="Username" onChange={(e) => setField('userName', e.target.value)} maxLength="100" />
          <br />
          <label htmlFor="username" className="new-f-error" id="f-error">
            {hasError.userName ? hasError.userName : ''}
          </label>
          <input type="email" placeholder="Email Address" onChange={(e) => setField('emailAddress', e.target.value)} />
          <br />
          <label htmlFor="email" className="new-f-error" id="f-error">
            {hasError.emailAddress ? hasError.emailAddress : ''}
          </label>
          <input type="password" placeholder="Password" onChange={(e) => setField('password', e.target.value)} />
          <br />
          <label htmlFor="password" className="new-f-error" id="f-error">
            {hasError.password ? hasError.password : ''}
          </label>
          <input type="password" placeholder="Confirm Password" onChange={(e) => setField('confirmPassword', e.target.value)} />
          <br />
          <label htmlFor="confirmPassword" className="new-f-error" id="f-error">
            {hasError.confirmPassword ? hasError.confirmPassword : ''}
          </label>
          <button onClick={validateSignUp}>Sign Up</button>
        </div>
        <div className="sulg-bottom-div">
          <button onClick={returntoWelcomePage}>Back to Welcome Page</button>
          <button onClick={directToLoginPage}>Log In</button>
        </div>
      </div>
    </>
  );
}

export default SignUpContainer;
