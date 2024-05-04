import React, { useState, useEffect } from 'react';
import '../../stylesheets/QuestionsPage.css';
import QuestionContainers from './QuestionContainers';
import axios from 'axios';

function QuestionsPage({ updatePage, currentSearch, currentSession, questions, username, userid }) {
  useEffect(function() {
    window.scrollTo(0, 0);
  }, []);
  const [questionSortMode, setQuestionSortMode] = useState('latest');
  const [questionsList, setQuestionsList] = useState([]);

  function numberOfQuestions() {
    return typeof questionsList === 'string' ? 0 : questionsList.length;
  }
  

useEffect(() => {
  username
    ? setQuestionsList(questions)
    : questionsBasedOnMode(questionSortMode, currentSearch).then(res => {
        setQuestionsList(() => res);
      });
}, [currentSearch, questionSortMode, username, questions]);


  function questionsBasedOnMode(questionSortMode, currentSearch) {
    if (currentSearch.search !== '') {
      let encodedSearch = encodeURIComponent(currentSearch.search);
      
      const endpoints = {
        'latest': `http://localhost:8000/posts/questions/search/${encodedSearch}`,
        'active': `http://localhost:8000/posts/questions/active/${encodedSearch}`,
        'unanswered': `http://localhost:8000/posts/questions/unanswered/${encodedSearch}`
      };
    
      const axiosRequests = {
        'latest': axios.get(endpoints['latest']),
        'active': axios.get(endpoints['active']),
        'unanswered': axios.get(endpoints['unanswered'])
      };
    
      const getQuestions = async (endpoint) => {
        try {
          const res = await axiosRequests[endpoint];
          const questions = res.data;
          const promises = questions.map(function(question) {
            return axios.get(`http://localhost:8000/users/getUsername/${question.asked_by}`).then(function(res) {
              question.username = res.data;
              return question;
            });
          });
          return Promise.all(promises);
        } catch (err) {
          console.log(err);
          return 'error';
        }
      };
    
      return getQuestions(questionSortMode);
    }
    const endpoints = {
      'unanswered': 'http://localhost:8000/posts/questions/unanswered',
      'active': 'http://localhost:8000/posts/questions/active',
      'latest': 'http://localhost:8000/posts/questions/newest'
    };
    
    const getQuestions = async (endpoint) => {
      try {
        const res = await axios.get(endpoint);
        const questions = res.data;
        const promises = questions.map(function(question) {
          return axios.get(`http://localhost:8000/users/getUsername/${question.asked_by}`).then(function(res) {
            question.username = res.data;
            return question;
          });
        });
        return Promise.all(promises);
      } catch (err) {
        console.log(err);
        return 'error';
      }
    };
    
    if (endpoints.hasOwnProperty(questionSortMode)) {
      return getQuestions(endpoints[questionSortMode]);
    } else {
      return Promise.resolve();
    }
    
  }

  function displayQuestions() {
    return questionsList === 'error' ? (
      React.createElement(
        'h1',
        { id: 'questions-error-message' },
        'An error occurred while fetching questions from the server. Please try again later.',
        React.createElement('br'),
        React.createElement('br'),
        React.createElement(
          'div',
          { onClick: function() { window.location.reload(false); } },
          'Return to Welcome Page'
        )
      )
    ) : (
      React.createElement(QuestionContainers, {
        questions: questionsList,
        updatePage: updatePage,
        userSession: currentSession,
        username: username,
        userid: userid
      })
    );
    
  }

  function askButtonSownIfLogin() {
    return currentSession.loggedIn ? (
      React.createElement(
        'button',
        { id: 'main-ask', onClick: function() { updatePage('ask-question'); } },
        'Ask Question'
      )
    ) : (
      React.createElement(React.Fragment, null)
    );
  }

  function sortByButton() {
    return username ? null : (
      React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'button',
          { id: 'main-unanswered', onClick: function() { setQuestionSortMode('unanswered'); } },
          'Unanswered'
        ),
        React.createElement(
          'button',
          { id: 'main-active', onClick: function() { setQuestionSortMode('active'); } },
          'Active'
        ),
        React.createElement(
          'button',
          { id: 'main-newest', onClick: function() { setQuestionSortMode('latest'); } },
          'Newest'
        )
      )
    );
  }
  
  const tagSearchResult = currentSearch.tagSearch
    ? `All Questions With Tag: ${currentSearch.search.slice(1, -1)}`
    : 'Search Results';
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { id: 'upper-main' },
      React.createElement(
        'div',
        { id: 'top-upper-main' },
        React.createElement(
          'h1',
          { id: 'top-upper-main-title' },
          username
            ? `All Questions Answered By ${username}`
            : currentSearch.search === ''
            ? 'All Questions'
            : tagSearchResult
        ),
        askButtonSownIfLogin()
      ),
      React.createElement(
        'div',
        { id: 'bottom-upper-main' },
        React.createElement(
          'h3',
          { id: 'number-of-questions' },
          `${numberOfQuestions()} question${numberOfQuestions() > 1 ? 's' : ''}`
        ),
        sortByButton()
      )
    ),
    React.createElement('div', { id: 'lower-main' }, displayQuestions())
  );
}

export default QuestionsPage;
