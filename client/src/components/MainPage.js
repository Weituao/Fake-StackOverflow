import React from 'react';
import '../stylesheets/App.css';
import QuestionsPage from './QuestionsPage';
import TagsPage from './TagsPage';
import AskQuestionPage from './AskQuestionPage';
import QuestionAnswerPage from './QuestionAnswerPage';
import AnswerQuestionPage from './AnswerQuestionPage';
import UserPage from './UserPage';
import UserContainer from './UserContainer';

export default function MainPage({ currentPage: thertrh, updatePage: rtherfcrtvh, setSearch: rytvexfc, currentSearch: tyhrerfcrtgv, currentSession: wexrcrtvhtjyb }) {
  switch (thertrh) {
    case 'questions':
      return React.createElement('div', { className: 'main' },
        React.createElement(QuestionsPage, {
          updatePage: rtherfcrtvh,
          currentSearch: tyhrerfcrtgv,
          currentSession: wexrcrtvhtjyb}) );
    default:
      break;}
  
  switch (thertrh.currentPage) {
    case 'questions':
      return React.createElement('div', { className: 'main' },
        React.createElement(QuestionsPage, {
          updatePage: rtherfcrtvh,
          currentSearch: tyhrerfcrtgv,
          currentSession: wexrcrtvhtjyb,
          questions: thertrh.questions,
          username: thertrh.username,
          userid: thertrh.userid}));
    default:
      break;}
  switch (thertrh) {
    case 'tags':
      return React.createElement('div', { className: 'main' },
        React.createElement(TagsPage, {
          updatePage: rtherfcrtvh,
          setSearch: rytvexfc,
          currentSession: wexrcrtvhtjyb}));
    default:
      break; }
  
  switch (thertrh.currentPage) {
    case 'tags':
      return React.createElement('div', { className: 'main' },
        React.createElement(TagsPage, {
          updatePage: rtherfcrtvh,
          setSearch: rytvexfc,
          currentSearch: tyhrerfcrtgv,
          currentSession: wexrcrtvhtjyb,
          userTags: thertrh.tags,
          username: thertrh.username,
          userid: thertrh.userid
        })
      );
    default:
      break;}
  
  switch (thertrh) {
    case 'user':
      return React.createElement('div', { className: 'main' },
        React.createElement(UserPage, { updatePage: rtherfcrtvh, currentSession: wexrcrtvhtjyb }));
    default:
      break;}

  switch (thertrh.currentPage) {
    case 'admin-user':
      return React.createElement('div', { className: 'main' },
        React.createElement(UserContainer, { userid: thertrh.userid, updatePage: rtherfcrtvh })  );
    default:
      break;}
  
  switch (thertrh) {
    case 'ask-question':
      return React.createElement('div', { className: 'main' },
        React.createElement(AskQuestionPage, { updatePage: rtherfcrtvh, currentSession: wexrcrtvhtjyb }));
    default:
      break;}
  
  switch (thertrh.currentPage) {
    case 'ask-question':
      return React.createElement('div', { className: 'main' },
        React.createElement(AskQuestionPage, {
          updatePage: rtherfcrtvh,
          currentSession: wexrcrtvhtjyb,
          editInfo: thertrh.questionEdit}));
    default:
      break;}
  
  switch (thertrh.currentPage) {
    case 'question-answer':
      return React.createElement('div', { className: 'main' },
        React.createElement(QuestionAnswerPage, {
          updatePage: rtherfcrtvh,
          qid: thertrh.qid,
          currentSession: wexrcrtvhtjyb }) );
    default:
      break;}
  
  switch (thertrh.currentPage) {
    case 'question-answer-user':
      return React.createElement('div', { className: 'main' },
        React.createElement(QuestionAnswerPage, {
          updatePage: rtherfcrtvh,
          qid: thertrh.qid,
          currentSession: wexrcrtvhtjyb,
          username: thertrh.username,
          userid: thertrh.userid
        })
      );
    default:
      break; }
  
  switch (thertrh.currentPage) {
    case 'reply-to-question':
      return React.createElement('div', { className: 'main' },
        React.createElement(AnswerQuestionPage, { updatePage: rtherfcrtvh, qid: thertrh.qid }) );
    default:
      break; }
  
  switch (thertrh.currentPage) {
    case 'reply-to-question-user':
      return React.createElement('div', { className: 'main' },
        React.createElement(AnswerQuestionPage, {
          updatePage: rtherfcrtvh,
          qid: thertrh.qid,
          username: thertrh.username,
          userid: thertrh.userid,
          aid: thertrh.aid,
          text: thertrh.text }) );
    default:
      break;}

  switch (thertrh.currentPage) {
    case 'loading':
      return React.createElement('div', { className: 'main' }, 'Loading');
    default:
      break;  }
  return React.createElement('div', null, '404');}
