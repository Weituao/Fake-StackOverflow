import generateDate from '../utils/generateDate';
import GenerateHtmlForTags from '../utils/generateHtmlForTags';
import CommentContainer from './CommentContainer';
import axios from 'axios';
import React, { useState } from 'react';

function QuestionContainers({ questions, updatePage, userSession, username, userid }) {
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  function handleNextClick() {
    setCurrentPage(function(currentPage) {
      return currentPage === totalPages ? 1 : currentPage + 1;
    });
  }
  

  function handleBackClick() {
    setCurrentPage(function(currentPage) {
      return currentPage === 1 ? currentPage : currentPage - 1;
    });
  }
  
  switch (currentQuestions.length) {
    case 0:
      return React.createElement(
        'div',
        { id: 'no-question-found' },
        React.createElement('h1', null, 'No questions found')
      );
    default:
      // Your default case or subsequent logic if needed
      break;
  }
  

  function writeSummaryIfExist(question) {
    switch (question.summary !== undefined) {
      case true:
        return React.createElement('p', null, question.summary);
      default:
        return null;
    }
  }

  function upVoteButtonClicked(question) {
    return new Promise((resolve, reject) => {
      switch (true) {
        case !(userSession.reputation && userSession.reputation >= 50):
          resolve();
          break;
        default:
          let userAlreadyVoted = question.voters.filter((voter) => voter.userVoted === userSession.userId);
          switch (userAlreadyVoted && userAlreadyVoted.direction !== 1) {
            case true:
              axios
                .patch(`http://localhost:8000/posts/questions/incrementVotes/${question._id}/${userSession.userId}`)
                .then(() => {
                  updatePage(() => 'loading');
                  setTimeout(() => {
                    updatePage(() => 'questions');
                    resolve();
                  }, 10);
                })
                .catch((error) => {
                  reject(error);
                });
              break;
            default:
              resolve();
              break;
          }
          break;
      }
    });
  }
  
  

  function downVoteButtonClicked(question) {
    return new Promise((resolve, reject) => {
      switch (true) {
        case !(userSession.reputation && userSession.reputation >= 50):
          resolve();
          break;
        default:
          let userAlreadyVoted = question.voters.filter((voter) => voter.userVoted === userSession.userId);
          switch (userAlreadyVoted && userAlreadyVoted.direction !== -1) {
            case true:
              axios
                .patch(`http://localhost:8000/posts/questions/decrementVotes/${question._id}/${userSession.userId}`)
                .then(() => {
                  updatePage(() => 'loading');
                  setTimeout(() => {
                    updatePage(() => 'questions');
                    resolve();
                  }, 10);
                })
                .catch((error) => {
                  reject(error);
                });
              break;
            default:
              resolve();
              break;
          }
          break;
      }
    });
  }
  


  const questionsList = currentQuestions.map(function(question) {
    return React.createElement(
      'div',
      { key: question._id, className: 'question-container' },
      React.createElement(
        'div',
        { className: 'vote-container' },
        React.createElement(
          'button',
          {
            disabled:
              !userSession.loggedIn || userSession.reputation < 50 || userSession.userId === question.asked_by,
            onClick: function() {
              upVoteButtonClicked(question);
            },
            className: 'upvote-button',
          },
          'Upvote'
        ),
        React.createElement('div', { className: 'vote-counter' }, question.votes),
        React.createElement(
          'button',
          {
            disabled:
              !userSession.loggedIn || userSession.reputation < 50 || userSession.userId === question.asked_by,
            onClick: function() {
              downVoteButtonClicked(question);
            },
            className: 'downvote-button',
          },
          'Downvote'
        )
      ),
      React.createElement(
        'div',
        { className: 'question-content-div' },
        React.createElement(
          'div',
          { id: 'question-content-div-top' },
          React.createElement(
            'h2',
            {
              id: question._id,
              onClick: function() {
                switch (true) {
                  case !!username:
                    updatePage({
                      currentPage: 'question-answer-user',
                      qid: question._id,
                      username: username,
                      userid: userid,
                    });
                    break;
                  default:
                    axios
                      .patch('http://localhost:8000/posts/questions/incrementViews/' + question._id)
                      .then(() => {
                        updatePage({ currentPage: 'question-answer', qid: question._id });
                      })
                      .catch(() => {
                        alert('An Error Occurred');
                      });
                    break;
                }
              },
            },
            question.title
          ),
          writeSummaryIfExist(question),
          React.createElement(GenerateHtmlForTags, { tagIds: question.tags, qid: question._id })
        )
      ),
      React.createElement(
        'div',
        { className: 'question-metadata-div' },
        React.createElement('h6', null, question.answers.length, ' answers'),
        React.createElement('h6', null, question.views, ' views'),
        React.createElement('h4', { id: question.asked_by }, question.username, '\u00A0'),
        React.createElement('h5', null, 'asked ', generateDate(question.ask_date_time, new Date()), ' '),
      ),
      React.createElement('hr', null),
      React.createElement(CommentContainer, { question_id: question._id, updatePage: updatePage, userSession: userSession })
    );
  });
  

  function renderPagination() {
    return React.createElement(
      'div',
      { className: 'pagination' },
      React.createElement(
        'button',
        { className: 'pagination-button', disabled: currentPage === 1, onClick: handleBackClick },
        'Back'
      ),
      React.createElement('button', { className: 'pagination-button', onClick: handleNextClick }, 'Next')
    );
  }

  return React.createElement(React.Fragment, null, React.createElement('div', { className: 'all-question-containers' }, questionsList), renderPagination());
}

export default QuestionContainers;
