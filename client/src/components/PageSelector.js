import React, { useState } from 'react';
import '../stylesheets/NavBar.css';
import MainPage from './MainPage';
import Header from './header/Header';

function NavBar({ currentPage, welcomePage, sessionActive, updateSession }) {
  const [selectedNav, setSelectedNav] = useState(currentPage || 'none');
  const [currentSearch, setSearch] = useState({ tagSearch: false, search: '' });

  function updateSelectedNav(navValue) {
    setSelectedNav(navValue);
  }

  function updateSearch(searchValue) {
    setSearch(searchValue);
  }

  function navQuestionClick() {
    setSelectedNav('questions');
    setSearch({ tagSearch: false, search: '' });
  }

  function navTagsClick() {
    setSelectedNav('tags');
    setSearch({ tagSearch: false, search: '' });
  }

  function navUserClick() {
    setSelectedNav('user');
    setSearch({ tagSearch: false, search: '' });
  }

  return (
    React.createElement('div', null,
      React.createElement(Header, {
        setSearch: updateSearch,
        updatePage: updateSelectedNav,
        updateSession: updateSession,
        currentSession: sessionActive,
        welcomePage: welcomePage
      }),
      React.createElement('div', { id: 'nav-main-div' },
        React.createElement('div', { id: 'nav', className: 'nav' },
          React.createElement('button', {
            id: 'nav-questions',
            onClick: navQuestionClick,
            className: 'nav-button',
            style: {
              backgroundColor: selectedNav === 'questions' ? 'lightgray' : 'white'
            }
          }, 'Questions'),
          React.createElement('button', {
            id: 'nav-tags',
            onClick: navTagsClick,
            className: 'nav-button',
            style: {
              backgroundColor: selectedNav === 'tags' ? 'lightgray' : 'white'
            }
          }, 'Tags'),
          React.createElement('button', {
            id: 'nav-tags',
            onClick: navUserClick,
            className: 'nav-button',
            style: {
              backgroundColor: selectedNav === 'user' ? 'lightgray' : 'white'
            }
          }, 'User')
        ),
        React.createElement(MainPage, {
          currentPage: selectedNav,
          updatePage: updateSelectedNav,
          setSearch: updateSearch,
          currentSearch: currentSearch,
          currentSession: sessionActive
        })
      )
    )
  );
}

export default NavBar;
