import React, { useState, useEffect } from 'react';
import '../../stylesheets/TagsPage.css';
import TagsWrapper from './TagsWrapper';
import axios from 'axios';

function TagsPage({ updatePage, setSearch, currentSession, userTags, username, userid }) {
  const [tagsObj, setTagsObj] = useState([]);

  useEffect(function () {
    const source = axios.CancelToken.source();
    
    switch (userTags) {
      case true:
        setTagsObj(userTags);
        return function () {
          source.cancel('Component unmounted');
        };
      default:
        axios
          .get(`http://localhost:8000/posts/tags`, {
            cancelToken: source.token,
          })
          .then(function (res) {
            setTagsObj(res.data);
          })
          .catch(function (err) {
            switch (true) {
              case axios.isCancel(err):
                console.log('Request cancelled:', err.message);
                break;
              default:
                console.log('Request failed:', err.message);
                setTagsObj('An error occurred while fetching tags from the server. Please try again later.');
                break;
            }
          });
          
        return function () {
          source.cancel('Component unmounted');
        };
    }
  }, [userTags]);
  
  useEffect(function () {
    window.scrollTo(0, 0);
  }, []);

  function showError() {
    return React.createElement(
      'h1',
      { id: 'tags-error-message' },
      'An error occurred while fetching tags from the server. Please try again later.',
      React.createElement('br', null),
      React.createElement('br', null),
      window.location.reload(false)
        ? React.createElement('div', { onClick: () => window.location.reload(false) }, 'Return to Welcome Page')
        : null
    );
  }
  

  function askButtonSownIfLogin() {
    return currentSession.loggedIn
      ? React.createElement(
          'button',
          { id: 'main-ask', onClick: () => updatePage('ask-question') },
          'Ask Question'
        )
      : null;
  }
  

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { id: 'upper-main-tags' },
      React.createElement(
        'div',
        { id: 'top-upper-main-tags' },
        React.createElement(
          'h1',
          { id: 'top-upper-main-title-tags' },
          userTags ? "All Tags Created By " + username : 'All Tags'
        ),
        askButtonSownIfLogin(),
        React.createElement(
          'h1',
          { id: 'number-of-tags' },
          ' ',
          tagsObj === 'An error occurred while fetching tags from the server. Please try again later.'
            ? 0
            : tagsObj.length,
          ' Tags'
        )
      )
    ),
    React.createElement(
      'div',
      { id: 'lower-main' },
      React.createElement(
        'div',
        { id: 'tags-wrapper-div' },
        tagsObj === 'An error occurred while fetching tags from the server. Please try again later.'
          ? showError()
          : React.createElement(TagsWrapper, { updatePage: updatePage, setSearch: setSearch, tags: tagsObj, username: username, userid: userid })
      )
    )
  );
}

export default TagsPage;
