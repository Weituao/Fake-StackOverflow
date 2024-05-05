import React, { useEffect, useState } from 'react';
import '../../stylesheets/QuestionAnswerPage.css';
import GenerateHtmlForTags from '../utils/generateHtmlForTags';
import AnswerContainers from './AnswerContainers';
import parseContent from '../utils/parseContent';
import generateDate from '../utils/generateDate';
import axios from 'axios';

function QuestionAnswerPage({ updatePage, qid, currentSession, username, userid }) {
  useEffect(function() {
    window.scrollTo(0, 0);
  }, []);

  const [question, setQuestion] = useState({});

  useEffect(function() {
    axios
      .get(`http://localhost:8000/posts/questions/${qid}`)
      .then(async function(res) {
        const question = res.data;
        const username = await axios.get(`http://localhost:8000/users/getUsername/${question.asked_by}`);
        question.username = username.data;
        setQuestion(question);
      })
      .catch(function() {
        alert('Error getting question');
      });
  }, [qid, updatePage]);

  function ansButtonSownIfLogin() {
    return currentSession.loggedIn ? (
      React.createElement('button', {
        className: 'ans-main-answer',
        onClick: function() {
          updatePage({ currentPage: 'reply-to-question', qid: question._id });
        }
      }, 'Answer Question')
    ) : React.createElement(React.Fragment, null);
  }

  return (
    React.createElement('div', null,
      Object.keys(question).length === 0 ? React.createElement('div', null, 'Loading...') :
        React.createElement('div', { id: 'upper-main-Answers' },
          React.createElement('div', { id: 'top-upper-mainAns' },
            React.createElement('h3', { id: 'top-upper-main-numAns' }, `${question.answers.length} answers`),
            React.createElement('h1', { id: 'top-upper-main-title' }, question.title),
            React.createElement('div', { id: 'bottom-upper-mainAns' },
              React.createElement('h3', { id: 'top-upper-main-numViews' }, `${question.views} views`),
              React.createElement('p', { id: 'top-upper-main-questionContent' }, parseContent(question.text)),
              React.createElement('div', { id: 'question-content-div-bottom', style: { marginTop: '10%' } },
              React.createElement(GenerateHtmlForTags, { tagIds: question.tags, qid: question._id })
              ),
              React.createElement('div', { className: 'top-upper-main-QAskedBy' },
                React.createElement('h4', { id: question.asked_by }, `${question.username} `),
                React.createElement('h5', null, `asked ${generateDate(question.ask_date_time, new Date())}`)
              )
            )
          )
        ),
      React.createElement('div', { id: 'lower-main-Answers' },
        React.createElement(AnswerContainers, {
          question_id: qid,
          updatePage: updatePage,
          userSession: currentSession,
          username: username,
          userid: userid
        }),
        React.createElement('div', { className: 'answer-container-last' }, ansButtonSownIfLogin())
      )
    )
  );
}

export default QuestionAnswerPage;
