import React, { useEffect } from 'react';
import axios from 'axios';
import '../../stylesheets/Header.css';

function Header({ setSearch, updatePage, updateSession, currentSession, welcomePage }) {
  function searchQuestion(e) {
    switch (e.key) {
      case 'Enter':
        setSearch({ tagSearch: false, search: e.target.value });
        updatePage('questions');
        e.target.value = '';
        break;
      default:
        // Handle other key events if necessary
        break;
    }
  }
  

  function headerButtonClicked() {
    const handleLogout = () => {
      updateSession({ loggedIn: false, username: '', email: '' });
      welcomePage('login');
    };
  
    const handleLogin = () => {
      alert('Error logging out');
    };
  
    currentSession.loggedIn
      ? axios
          .post('http://localhost:8000/users/logout')
          .then(() => {
            updateSession({ loggedIn: false, username: '', email: '' });
            welcomePage('welcome');
          })
          .catch(handleLogin)
      : handleLogout();
  }
  
  
  

  const handleTitleClick = () => false;


  useEffect(() => {
    const updateSessionData = (res) => updateSession(res.data);
    const handleSessionError = (err) => console.log(err);
  
    axios
      .get('http://localhost:8000/users/session')
      .then(updateSessionData)
      .catch(handleSessionError);
  }, [updateSession]);
  

  return (
    React.createElement('div', { id: 'header', className: 'header' }, [
      React.createElement('div', { id: 'header-button-div' }, [
        React.createElement('button', { onClick: headerButtonClicked }, currentSession.loggedIn ? 'Log Out' : 'Log In')
      ]),
      React.createElement('div', { id: 'header-title-div' }, [
        React.createElement('a', {
          id: 'header-title',
          href: '/',
          onClick: handleTitleClick
        }, 'Fake Stack Overflow')
      ]),
      React.createElement('div', { id: 'header-search-div' }, [
        React.createElement('input', {
          id: 'header-search',
          onKeyUp: searchQuestion,
          type: 'text',
          name: 'search',
          placeholder: 'Search...'
        })
      ])
    ])
  );
}

export default Header;
