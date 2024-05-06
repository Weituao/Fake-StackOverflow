import React, { useState, useEffect } from 'react';
import '../stylesheets/AnswerQuestionPage.css';
import validateHyperLinks from './validateHyperLinks';
import axios from 'axios';

export default function AnswerQuestionPage({ updatePage, qid, username, userid, aid, text }) {
  useEffect(function () {
    window.scrollTo(0, 0);}, []);
  const [hasError, setHasError] = useState(null);
  const [answer, setAnswer] = useState('');

  function getan(e) {
    setAnswer(e.target.value.trim()); }

  function isan(qid) {
    const newStateHasError =
      answer.length === 0
        ? 'Answer cannot be empty'
        : validateHyperLinks(answer)
        ? 'Hyperlink cannot be empty and must start with http:// or https://'
        : null;
    setHasError(newStateHasError);
    if (!newStateHasError) {
      const newAnswer = {
        qid: qid,
        text: `${answer}`,
        ans_by: userid,  };
      const requestUrl = username
        ? `http://localhost:8000/posts/answers/editAnswer/${aid}`
        : 'http://localhost:8000/posts/answers/answerQuestion';
      const requestPromise = username
        ? axios.put(requestUrl, newAnswer)
        : axios.post(requestUrl, newAnswer);
      requestPromise.then(() => {
        updatePage({
          currentPage: username ? 'question-answer-user' : 'question-answer',
          qid: qid,
          username: username,
          userid: userid,});});}}

  return React.createElement(
    'div',
    { id: 'ask-question' },
    React.createElement('h2', null, 'Answer Text*'),
    React.createElement('label', { htmlFor: 'content' }, 'Write answer here'),
    React.createElement('textarea', {
      onChange: function (e) {
        getan(e);
      },
      id: 'ans-new-content',
      name: 'content',
      defaultValue: username ? text : ''
    }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement('label', { htmlFor: 'title', className: 'new-q-error', id: 'ans-content-error' }, hasError === null ? '' : hasError),
    React.createElement('input', {
      type: 'submit',
      className: 'submit-question',
      id: qid,
      value: 'Post Answer',
      onClick: function () {
        isan(qid);}}),);}
