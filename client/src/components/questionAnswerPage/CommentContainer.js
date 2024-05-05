import axios from 'axios';
import parseContent from '../utils/parseContent';
import React, { useState, useEffect } from 'react';

function CommentContainer({ question_id, answer_id, updatePage, userSession }) {
  const [commentListObj, setCommentListObj] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentcomments = commentListObj.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(commentListObj.length / commentsPerPage);

  useEffect(function() {
    axios.get(`http://localhost:8000/posts/answers/comments/${answer_id}`).then(async function(res) {
      const comments = res.data;
      const promises = comments.map(async function(comment) {
        const res = await axios.get(`http://localhost:8000/users/getUsername/${comment.com_by}`);
        comment.username = res.data;
        return comment;
      });
      const results = await Promise.all(promises);
      setCommentListObj([...results]);
    });
  }, [answer_id]);

  function handleNextClick() {
    setCurrentPage(currentPage => (currentPage === totalPages ? 1 : currentPage + 1));
  }
  

  function handleBackClick() {
    setCurrentPage(currentPage => currentPage - 1);
  }
  

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


  function upVoteButtonClicked(comment) {
    return new Promise((resolve, reject) => {
      let userAlreadyVoted = comment.voters.filter((voter) => voter.userVoted === userSession.userId);
      switch (true) {
        case !(userAlreadyVoted && userAlreadyVoted.direction !== 1):
          resolve();
          break;
        default:
          axios
            .patch(`http://localhost:8000/posts/answers/comments/incrementVotes/${comment._id}/${userSession.userId}`)
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
      }
    });
  }
  
  

  function renderPagination() {
    return currentcomments.length > 0 ? (
      React.createElement('div', { className: 'pagination-comments' },
        React.createElement('button', { className: 'pagination-button', disabled: currentPage === 1, onClick: handleBackClick }, 'Back'),
        React.createElement('button', { className: 'pagination-button', disabled: totalPages <= 1, onClick: handleNextClick }, 'Next')
      )
    ) : null;
  }
  

  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  async function addCommentToAnswer(commentText) {
    const commentType = 'answer';
    const toId = answer_id;
    const com_by = userSession.userId;
    const newComment = {
      text: commentText,
      com_by: com_by,
      commentType: commentType,
      toId: toId,
    };
    const res = await axios.post('http://localhost:8000/posts/comments/addComment', newComment);
    switch (res.data) {
      case 'success':
        setCommentText('');
        setCommentError('');
        updatePage(function() { return 'loading'; });
        await sleep(10);
        updatePage({ currentPage: 'question-answer', qid: question_id });
        break;
      case 'User reputation too low':
        setCommentError('You cannot make a comment because your reputation is lower than 50');
        break;
      case 'Comment must be between 1 and 140 characters':
        setCommentError('Comment must be between 1 and 140 characters');
        break;
      default:
        break;
    }
  }

  function renderNewCommentInput() {
    switch (!userSession.loggedIn) {
      case true:
        return null;
      default:
        function handleCommentTextChange(event) {
          setCommentText(event.target.value);
        }
  
        function handleAddCommentClick() {
          addCommentToAnswer(commentText);
        }
  
        return (
          React.createElement('div', { className: 'new-comment-input' },
            React.createElement('textarea', {
              className: 'new-comment-textarea',
              placeholder: 'Add a comment',
              value: commentText,
              onChange: handleCommentTextChange
            }),
            React.createElement('button', { className: 'new-comment-button', onClick: handleAddCommentClick }, 'Add Comment'),
            React.createElement('div', { className: 'comment-error' }, commentError)
          )
        );
    }
  }

  const commentList = currentcomments.map(function(element) {
    return (
      React.createElement('div', { key: element._id, className: 'comment-container' },
        React.createElement('div', { className: 'vote-container' },
          React.createElement('button', {
            disabled: !userSession.loggedIn || userSession.userId === element.com_by,
            onClick: function() { upVoteButtonClicked(element); },
            className: 'upvote-button'
          }, 'Upvote'),
          React.createElement('div', { className: 'vote-counter' }, element.votes)
        ),
        React.createElement('div', { className: 'comment-content-div' },
          React.createElement('p', null, parseContent(element.text))
        ),
        React.createElement('div', { className: 'comment-metadata-div' },
          React.createElement('h4', { id: element.com_by }, 'commented By ', element.username, ' ')
        )
      )
    );
  });

  return (
    React.createElement(React.Fragment, null,
      commentList, renderNewCommentInput(), renderPagination()
    )
  );
}

export default CommentContainer;
