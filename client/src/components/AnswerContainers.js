import React, { useState, useEffect } from 'react';
import parseContent from './parseContent';
import generateDate from './generateDate';
import CommentContainer from './questionAnswerPage/CommentContainer';
import axios from 'axios';

function AnswerContainers({ question_id, updatePage, userSession, username, userid }) {
  const [answerListObj, setAnswerListObj] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteAnswer, setDeleteAnswer] = useState({ answer_id: '', delete: false });
  const answersPerPage = 5;
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentanswers = answerListObj.slice(indexOfFirstAnswer, indexOfLastAnswer);
  const totalPages = Math.ceil(answerListObj.length / answersPerPage);
  
  useEffect(function() {
    axios.get(`http://localhost:8000/posts/answers/${question_id}`).then(async function(res) {
      const answers = res.data;
      const promises = answers.map(async function(answer) {
        const res = await axios.get(`http://localhost:8000/users/getUsername/${answer.ans_by}`);
        answer.username = res.data;
        return answer;
      });
      let results = await Promise.all(promises);
      const filteredResults = results.filter(function(element) {
        return username ? (element.ans_by === userid ? true : false) : true;
      });
      setAnswerListObj([...filteredResults]);
    });
  }, [question_id, username, userid]);
  
  

  function handleNextClick() {
    setCurrentPage(currentPage => currentPage === totalPages ? 1 : currentPage + 1);
  }
  

  function handleBackClick() {
    setCurrentPage(currentPage => currentPage === 1 ? currentPage : currentPage - 1);
  }
  

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function upVoteButtonClicked(answer) {
    return new Promise((resolve, reject) => {
      if (!(userSession.reputation && userSession.reputation >= 50)) {
        resolve();
        return;
      }
      let userAlreadyVoted = answer.voters.filter((voter) => voter.userVoted === userSession.userId);
      switch (userAlreadyVoted && userAlreadyVoted.direction !== 1) {
        case true:
          axios
            .patch(`http://localhost:8000/posts/answers/incrementVotes/${answer._id}/${userSession.userId}`)
            .then(() => {
              updatePage(() => 'loading');
              setTimeout(() => {
                updatePage({ currentPage: 'question-answer', qid: question_id });
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
    });
  }
  

  function downVoteButtonClicked(answer) {
    return new Promise((resolve, reject) => {
      switch (true) {
        case !(userSession.reputation && userSession.reputation >= 50):
          resolve();
          break;
        default:
          let userAlreadyVoted = answer.voters.filter((voter) => voter.userVoted === userSession.userId);
          switch (userAlreadyVoted && userAlreadyVoted.direction !== -1) {
            case true:
              axios
                .patch(`http://localhost:8000/posts/answers/decrementVotes/${answer._id}/${userSession.userId}`)
                .then(() => {
                  updatePage(() => 'loading');
                  setTimeout(() => {
                    updatePage({ currentPage: 'question-answer', qid: question_id });
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
  

  
  function renderPagination() {
    return (
      React.createElement('div', { className: 'pagination' },
        React.createElement('button', { className: 'pagination-button', disabled: currentPage === 1, onClick: handleBackClick }, 'Back'),
        React.createElement('button', { className: 'pagination-button', disabled: totalPages <= 1, onClick: handleNextClick }, 'Next')
      )
    );
  }

  function renderDeleteAndEditButton(element) {
    return element.ans_by === userid ? (
      React.createElement('div', { className: 'delete-edit-button-container' },
        React.createElement('button', {
          className: 'delete-button',
          onClick: function() { setDeleteAnswer({ answer_id: element._id, delete: true }); }
        }, 'Delete'),
        React.createElement('button', {
          className: 'edit-button',
          onClick: function() {
            updatePage({
              currentPage: 'reply-to-question-user',
              qid: question_id,
              aid: element._id,
              userid: userid,
              username: username,
              text: element.text
            });
          }
        }, 'Edit')
      )
    ) : null;
  }
  

  function createDeleteWarn() {
    return (
      React.createElement('div', { className: 'delete-warning-container' },
        React.createElement('h3', null, 'Are you sure you want to delete this answer?'),
        React.createElement('button', { onClick: handleDelete }, 'Yes'),
        React.createElement('button', { onClick: handleCancel }, 'No')
      )
    );
  }

  async function handleDelete() {
    axios.delete(`http://localhost:8000/posts/answers/deleteAnswer/${deleteAnswer.answer_id}`);
    updatePage(function() { return 'loading'; });
    await sleep(10);
    updatePage({ currentPage: 'question-answer-user', qid: question_id, userid: userid, username: username });
  }

  function handleCancel() {
    setDeleteAnswer({ answer_id: '', delete: false });
  }

  let timeNow = new Date();
  const answerList = currentanswers.map(function(element) {
    return (
      React.createElement('div', { key: element._id, className: 'answer-container' },
        React.createElement('div', { className: 'vote-container' },
          React.createElement('button', {
            disabled: !userSession.loggedIn || userSession.reputation < 50 || userSession.userId === element.ans_by,
            onClick: function() { upVoteButtonClicked(element); },
            className: 'upvote-button'
          }, 'Upvote'),
          React.createElement('div', { className: 'vote-counter' }, element.votes),
          React.createElement('button', {
            disabled: !userSession.loggedIn || userSession.reputation < 50 || userSession.userId === element.ans_by,
            onClick: function() { downVoteButtonClicked(element); },
            className: 'downvote-button'
          }, 'Downvote')
        ),
        React.createElement('div', { className: 'answer-content-div' },
          React.createElement('p', null, parseContent(element.text))
        ),
        React.createElement('div', { className: 'answer-metadata-div' },
        renderDeleteAndEditButton(element),
        element._id === deleteAnswer.answer_id ? createDeleteWarn() : null,
        React.createElement('h4', { id: element.ans_by }, element.username + '  '),
        React.createElement('h5', null, 'answered ',  generateDate(element.ans_date_time, timeNow), ' ')

      ),
      
        React.createElement('hr', null),
        React.createElement(CommentContainer, {
          question_id: question_id,
          answer_id: element._id,
          updatePage: updatePage,
          userSession: userSession
        })
      )
    );
  });

  return (
    React.createElement(React.Fragment, null, answerList, ' ', renderPagination())
  );
}

export default AnswerContainers;
