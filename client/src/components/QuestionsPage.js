import React, { useState, useEffect } from 'react';
import '../stylesheets/QuestionsPage.css';
import QuestionContainers from './QuestionContainers';
import axios from 'axios';

export default function QuestionsPage({ updatePage, currentSearch, currentSession, questions, username, userid }) {
  useEffect(function() {
    window.scrollTo(0, 0); }, []);
  const [tyrrfce, edyhdfc] = useState('latest');
  const [yefc, rtyceht] = useState([]);
  function ytbjnrfd() {
    return typeof yefc === 'string' ? 0 : yefc.length;}

useEffect(() => {
  username
    ? rtyceht(questions)
    : ewrctvrh(tyrrfce, currentSearch).then(res => {
        rtyceht(() => res);
      });}, [currentSearch, tyrrfce, username, questions]);
  function ewrctvrh(questionSortMode, currentSearch) {
    if (currentSearch.search !== '') {
      let encodedSearch = encodeURIComponent(currentSearch.search);
      const exwrtgv = {
        'latest': `http://localhost:8000/posts/questions/search/${encodedSearch}`,
        'active': `http://localhost:8000/posts/questions/active/${encodedSearch}`,
        'unanswered': `http://localhost:8000/posts/questions/unanswered/${encodedSearch}`};
      const rhterfc = {
        'latest': axios.get(exwrtgv['latest']),
        'active': axios.get(exwrtgv['active']),
        'unanswered': axios.get(exwrtgv['unanswered'])};
    
      const getQuestions = async (endpoint) => {
        try {
          const bunyfgve = await rhterfc[endpoint];
          const seenow = bunyfgve.data;
          const istsd = seenow.map(function(question) {
            return axios.get(`http://localhost:8000/users/getUsername/${question.asked_by}`).then(function(res) {
              question.username = res.data;
              return question;  }); });
          return Promise.all(istsd);} catch (err) {
          console.log(err);
          return 'error';}};
      return getQuestions(questionSortMode);}
    const bigo = {
      'unanswered': 'http://localhost:8000/posts/questions/unanswered',
      'active': 'http://localhost:8000/posts/questions/active',
      'latest': 'http://localhost:8000/posts/questions/newest'};
    const ytvewf = async (endpoint) => {
      try {
        const srt = await axios.get(endpoint);
        const yjf = srt.data;
        const wexyt = yjf.map(function(question) {
          return axios.get(`http://localhost:8000/users/getUsername/${question.asked_by}`).then(function(res) {question.username = res.data;return question; });});
        return Promise.all(wexyt);} catch (err) {
        console.log(err);
        return 'error';}};
    if (bigo.hasOwnProperty(questionSortMode)) {
      return ytvewf(bigo[questionSortMode]);} else {
      return Promise.resolve(); }}
  function ueher() {
    return yefc === 'error' ? (
      React.createElement(
        'h1',
        { id: 'questions-error-message' },
        'An error occurred while fetching questions from the server. Please try again later.',
        React.createElement('br'),
        React.createElement('br'),
        React.createElement(
          'div',
          { onClick: function() { window.location.reload(false); } },
          'Return to Welcome Page' )  ) ) : (
      React.createElement(QuestionContainers, {
        questions: yefc,
        updatePage: updatePage,
        userSession: currentSession,
        username: username,
        userid: userid })); }
  function hegtgh() {
    return currentSession.loggedIn ? (
      React.createElement(
        'button',
        { id: 'top-upper-main-ask', onClick: function() { updatePage('ask-question'); } },
        'Ask Question') ) : (
      React.createElement(React.Fragment, null) );}
  function burk() {
    return username ? null : (
      React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'button',
          { id: 'main-unanswered', onClick: function() { edyhdfc('unanswered'); } },
          'Unanswered'),
        React.createElement(
          'button',
          { id: 'main-active', onClick: function() { edyhdfc('active'); } },
          'Active' ),
        React.createElement(
          'button',
          { id: 'main-newest', onClick: function() { edyhdfc('latest'); } },
          'Newest' )) );}
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
            : tagSearchResult ),
        hegtgh()),
      React.createElement(
        'div',
        { id: 'bottom-upper-main' },
        React.createElement(
          'h3',
          { id: 'number-of-questions' },
          `${ytbjnrfd()} question${ytbjnrfd() > 1 ? 's' : ''}`),
        burk() ) ),
    React.createElement('div', { id: 'lower-main' }, ueher()));}
