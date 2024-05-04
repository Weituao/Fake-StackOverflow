import React, { useState, useEffect } from 'react';
import '../../stylesheets/AnswerQuestionPage.css';
import validateHyperLinks from '../utils/validateHyperLinks';
import axios from 'axios';

function AnswerQuestionPage({ updatePage, qid, username, userid, aid, text }) {
  useEffect(function () {
    window.scrollTo(0, 0);
  }, []);
  
  const [hasError, setHasError] = useState(null);
  const [answer, setAnswer] = useState('');

  function setAnswerContent(e) {
    setAnswer(e.target.value.trim());
  }

  function validateAnswer(qid) {
    const newStateHasError =
      answer.length === 0
        ? '*Answer field cannot be empty'
        : validateHyperLinks(answer)
        ? '*Constraints violated. The target of a hyperlink, that is, the stuff within () cannot be empty and must begin with “https://” or “http://”.'
        : null;
  
    setHasError(newStateHasError);
  
    if (!newStateHasError) {
      const newAnswer = {
        qid: qid,
        text: `${answer}`,
        ans_by: userid,
      };
  
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
          userid: userid,
        });
      });
    }
  }
  

  return React.createElement(
    'div',
    { id: 'ask-question' },
    React.createElement('h2', null, 'Answer Text*'),
    React.createElement('label', { htmlFor: 'content' }, 'Write answer here'),
    React.createElement('textarea', {
      onChange: function (e) {
        setAnswerContent(e);
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
        validateAnswer(qid);
      }
    }),
    React.createElement('h3', null, '* indicates mandatory fields')
  );
}

export default AnswerQuestionPage;
