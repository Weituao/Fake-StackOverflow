import React from 'react';
import '../../stylesheets/MainPage.css';
import QuestionsPage from '../questionPage/QuestionsPage';
import TagsPage from '../tagsPage/TagsPage';
import AskQuestionPage from '../askQuestionPage/AskQuestionPage';
import QuestionAnswerPage from '../questionAnswerPage/QuestionAnswerPage';
import AnswerQuestionPage from '../answerQuestionPage/AnswerQuestionPage';
import UserPage from '../userPage/UserPage';
import UserContainer from '../userPage/UserContainer';

function MainPage({ currentPage, updatePage, setSearch, currentSearch, currentSession }) {
  switch (currentPage) {
    case 'questions':
      return React.createElement('div', { className: 'main' },
        React.createElement(QuestionsPage, {
          updatePage: updatePage,
          currentSearch: currentSearch,
          currentSession: currentSession
        })
      );
    default:
      // Handle default case here if necessary
      break;
  }
  
  switch (currentPage.currentPage) {
    case 'questions':
      return React.createElement('div', { className: 'main' },
        React.createElement(QuestionsPage, {
          updatePage: updatePage,
          currentSearch: currentSearch,
          currentSession: currentSession,
          questions: currentPage.questions,
          username: currentPage.username,
          userid: currentPage.userid
        })
      );
    default:
      // Handle default case here if necessary
      break;
  }
  
  switch (currentPage) {
    case 'tags':
      return React.createElement('div', { className: 'main' },
        React.createElement(TagsPage, {
          updatePage: updatePage,
          setSearch: setSearch,
          currentSession: currentSession
        })
      );
    default:
      // Handle default case here if necessary
      break;
  }
  
  switch (currentPage.currentPage) {
    case 'tags':
      return React.createElement('div', { className: 'main' },
        React.createElement(TagsPage, {
          updatePage: updatePage,
          setSearch: setSearch,
          currentSearch: currentSearch,
          currentSession: currentSession,
          userTags: currentPage.tags,
          username: currentPage.username,
          userid: currentPage.userid
        })
      );
    default:
      // Handle default case here if necessary
      break;
  }
  
  switch (currentPage) {
    case 'user':
      return React.createElement('div', { className: 'main' },
        React.createElement(UserPage, { updatePage: updatePage, currentSession: currentSession })
      );
    default:
      // Handle default case here if necessary
      break;
  }
  

  switch (currentPage.currentPage) {
    case 'admin-user':
      return React.createElement('div', { className: 'main' },
        React.createElement(UserContainer, { userid: currentPage.userid, updatePage: updatePage })
      );
    default:
      // Handle default case here if necessary
      break;
  }
  

  switch (currentPage) {
    case 'ask-question':
      return React.createElement('div', { className: 'main' },
        React.createElement(AskQuestionPage, { updatePage: updatePage, currentSession: currentSession })
      );
    default:
      // Handle default case here if necessary
      break;
  }
  
  switch (currentPage.currentPage) {
    case 'ask-question':
      return React.createElement('div', { className: 'main' },
        React.createElement(AskQuestionPage, {
          updatePage: updatePage,
          currentSession: currentSession,
          editInfo: currentPage.questionEdit
        })
      );
    default:
      // Handle default case here if necessary
      break;
  }
  
  switch (currentPage.currentPage) {
    case 'question-answer':
      return React.createElement('div', { className: 'main' },
        React.createElement(QuestionAnswerPage, {
          updatePage: updatePage,
          qid: currentPage.qid,
          currentSession: currentSession
        })
      );
    default:
      // Handle default case here if necessary
      break;
  }
  
  switch (currentPage.currentPage) {
    case 'question-answer-user':
      return React.createElement('div', { className: 'main' },
        React.createElement(QuestionAnswerPage, {
          updatePage: updatePage,
          qid: currentPage.qid,
          currentSession: currentSession,
          username: currentPage.username,
          userid: currentPage.userid
        })
      );
    default:
      // Handle default case here if necessary
      break;
  }
  
  switch (currentPage.currentPage) {
    case 'reply-to-question':
      return React.createElement('div', { className: 'main' },
        React.createElement(AnswerQuestionPage, { updatePage: updatePage, qid: currentPage.qid })
      );
    default:
      // Handle default case here if necessary
      break;
  }
  
  switch (currentPage.currentPage) {
    case 'reply-to-question-user':
      return React.createElement('div', { className: 'main' },
        React.createElement(AnswerQuestionPage, {
          updatePage: updatePage,
          qid: currentPage.qid,
          username: currentPage.username,
          userid: currentPage.userid,
          aid: currentPage.aid,
          text: currentPage.text
        })
      );
    default:
      // Handle default case here if necessary
      break;
  }
  

  switch (currentPage.currentPage) {
    case 'loading':
      return React.createElement('div', { className: 'main' }, 'Loading');
    default:
      // Handle default case here if necessary
      break;
  }
  

  return React.createElement('div', null, '404');
}

export default MainPage;