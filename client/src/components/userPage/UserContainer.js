import axios from 'axios';
import '../../stylesheets/UsersPage.css';
import generateDate from '../utils/generateDate';
import { getTagById } from '../utils/generateHtmlForTags';
import React, { useState, useEffect } from 'react';

function UserContainer({ userid, updatePage }) {
  const [user, setUser] = useState({});
  const [questions, setQuestions] = useState([]);
  const [showWarningQuestion, setShowWarningQuestion] = useState({ warning: false, questionId: '' });

  useEffect(function () {
    axios.get(`http://localhost:8000/users/getUserData/${userid}`).then(function (res) {
      setUser(res.data);
    });
    axios.get(`http://localhost:8000/posts/questions/byUser/${userid}`).then(function (res) {
      setQuestions(res.data);
    });
  }, [userid]);

  function getTimeElapsedString(date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const units = [
      { value: 1000, label: 'second' },
      { value: 60 * 1000, label: 'minute' },
      { value: 60 * 60 * 1000, label: 'hour' },
      { value: 24 * 60 * 60 * 1000, label: 'day' }
    ];
  
    const elapsedUnit = units.find(unit => diff < unit.value);
    const value = Math.floor(diff / (elapsedUnit ? elapsedUnit.value : 1));
    const label = elapsedUnit ? elapsedUnit.label : 'day';
    return `${value} ${label}${value === 1 ? '' : 's'}`;
  }

  return (
    React.createElement(React.Fragment, null,
      React.createElement('div', { id: 'upper-main' },
        React.createElement('div', { className: 'user-top-container' },
          React.createElement('div', { className: 'user-header' },
            React.createElement('h1', null, 'User Profile for user: ', user.username)
          ),
          React.createElement('div', { className: 'user-header' },
            React.createElement('h2', null, 'Member for ', getTimeElapsedString(new Date(user.created_at)))
          ),
          React.createElement('div', { className: 'user-header' },
            React.createElement('h3', null, 'Reputation Score: ', user.reputation)
          )
        )
      ),
      React.createElement('div', { id: 'lower-main' },
        React.createElement('div', { className: 'user-all-questions-container' },
          React.createElement('h2', { className: 'user-page-heading-title' },
            questions.length === 0
              ? `No questions found for ${user.username}`
              : `All questions ${user.username} has posted`
          ),
          questions.length === 0
            ? null
            : questions.map((question) => {
              function handleDeleteClick() {
                switch (showWarningQuestion.warning) {
                  case true:
                    deleteQuestion();
                    break;
                  default:
                    setShowWarningQuestion({ warning: true, questionId: question._id });
                    break;
                }
              }
              
                function handleCancelClick() {
                  setShowWarningQuestion({ warning: false, questionId: '' });
                }
                function deleteQuestion() {
                  const questionIdToDel = showWarningQuestion.questionId;
                  axios
                    .delete(`http://localhost:8000/posts/questions/deleteQuestion/${questionIdToDel}`)
                    .then((res) => {
                      switch (res.data) {
                        case 'success':
                          const newQuestions = questions.filter((question) => question._id !== questionIdToDel);
                          setQuestions(newQuestions);
                          setShowWarningQuestion({ warning: false, questionId: '' });
                          break;
                        default:
                          alert('Error deleting question');
                          break;
                      }
                      
                    });
                }
                return (
                  React.createElement('div', { key: question._id, className: 'question-container' },
                    React.createElement('div', { className: 'question-content-div' },
                      React.createElement('div', { id: 'question-content-div-top' },
                        React.createElement('h2', {
                          id: question._id,
                          onClick: async () => {
                            const tags = await Promise.all(question.tags.map((tagId) => getTagById(tagId)));
                            question.tags = tags.join(' ');
                            updatePage({ currentPage: 'ask-question', questionEdit: question });
                          }
                        }, question.title)
                      )
                    ),
                    React.createElement('div', { className: 'question-metadata-div' },
                      React.createElement('h5', null, 'asked ', generateDate(question.ask_date_time, new Date()))
                    ),
                    React.createElement('button', { id: 'user-self-delete-button', onClick: handleDeleteClick }, 'Delete'),
                    showWarningQuestion.questionId === question._id &&
                      React.createElement('div', { className: 'warning' },
                        React.createElement('p', null, 'Are you sure you want to delete this question?'),
                        React.createElement('button', { onClick: deleteQuestion }, 'Delete Question'),
                        React.createElement('button', { onClick: handleCancelClick }, 'Cancel')
                      )
                  )
                );
              })
        ),
        React.createElement('button', { className: 'user-bottom-button', onClick: async () => {
          const res = await axios.get(`http://localhost:8000/posts/tags/getUser/${userid}`);
          updatePage({ currentPage: 'tags', tags: res.data, username: user.username, userid: userid });
        } }, `All Tags Created By ${user.username}`),
        React.createElement('button', { className: 'user-bottom-button', onClick: async () => {
          const res = await axios.get(`http://localhost:8000/posts/answers/getQuestionsAnswered/${userid}`);
          updatePage({ currentPage: 'questions', questions: res.data, username: user.username, userid: userid });
        } }, `All Questions that Contain Answers By ${user.username}`)
      )
    )
  );
  
}

export default UserContainer;
