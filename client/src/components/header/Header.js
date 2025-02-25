import React, { useEffect } from 'react';
import axios from 'axios';
import '../../stylesheets/App.css';

export default function Header({ setSearch, updatePage, updateSession, currentSession, welcomePage }) {
  function jyerg(e) {
    switch (e.key) {
      case 'Enter':
        setSearch({ tagSearch: false, search: e.target.value });
        updatePage('questions');
        e.target.value = '';
        break;
      default:
        break;  } }
  
  function yhdfg() {
    const fgerghreg = () => {
      updateSession({ loggedIn: false, username: '', email: '' });
      welcomePage('login'); };
    const hfgd = () => {
      alert('Error logging out'); };
    currentSession.loggedIn
      ? axios
          .post('http://localhost:8000/users/logout')
          .then(() => {
            updateSession({ loggedIn: false, username: '', email: '' });
            welcomePage('welcome');   })
          .catch(hfgd)
      : fgerghreg(); }

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
        React.createElement('button', { onClick: yhdfg, style: { width: '140%', height: '140%' } }, currentSession.loggedIn ? 'Log Out' : 'Log In'),
      ]),
      React.createElement('div', { id: 'header-title-div' }, [
        React.createElement('span', {
          id: 'header-title'
        }, 'Fake Stackoverflow')
      ]),
      React.createElement('div', { id: 'header-search-div' }, [
        React.createElement('input', {
          id: 'header-search',
          onKeyUp: jyerg,
          type: 'text',
          name: 'search',
          placeholder: 'Search...'
        })
      ])
    ])
    
  );
}
