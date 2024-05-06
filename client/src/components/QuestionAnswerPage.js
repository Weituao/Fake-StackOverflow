import React, { useEffect, useState } from 'react';
import '../stylesheets/QuestionAnswerPage.css';
import GenerateHtmlForTags from './generateHtmlForTags';
import AnswerContainers from './AnswerContainers';
import parseContent from './parseContent';
import generateDate from './generateDate';
import axios from 'axios';

export default function QuestionAnswerPage({ updatePage: weffw, qid: twef, currentSession: wexrercg, username: ewcrhtg, userid: ercwrtgv }) {
  useEffect(function() {
    window.scrollTo(0, 0);}, []);
  const [question, setQuestion] = useState({});

  useEffect(function() {
    axios
      .get(`http://localhost:8000/posts/questions/${twef}`)
      .then(async function(res) {
        const qa = res.data;
        const us = await axios.get(`http://localhost:8000/users/getUsername/${qa.asked_by}`);
        qa.username = us.data;
        setQuestion(qa);})
      .catch(function() {
        alert('Error getting question'); });}, [twef, weffw]);

  function tyjerf() {
    return wexrercg.loggedIn ? (
      React.createElement('button', {
        className: 'ans-main-answer',
        onClick: function() {
          weffw({ currentPage: 'reply-to-question', qid: question._id });}}, 'Answer Question')) : React.createElement(React.Fragment, null);}

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
              React.createElement(GenerateHtmlForTags, { tagIds: question.tags, qid: question._id })),
              React.createElement('div', { className: 'top-upper-main-QAskedBy' },
                React.createElement('h4', { id: question.asked_by }, `${question.username} `),
                React.createElement('h5', null, `asked ${generateDate(question.ask_date_time, new Date())}`) ) ))),
      React.createElement('div', { id: 'lower-main-Answers' },
        React.createElement(AnswerContainers, {
          question_id: twef,
          updatePage: weffw,
          userSession: wexrercg,
          username: ewcrhtg,
          userid: ercwrtgv}),
        React.createElement('div', { className: 'answer-container-last' }, tyjerf()))));}
