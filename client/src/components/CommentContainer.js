import axios from 'axios';
import parseContent from './parseContent';
import React, { useState, useEffect } from 'react';

function CommentContainer({ question_id, updatePage, userSession }) {
  const [commentListObj, setCommentListObj] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentcomments = commentListObj.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(commentListObj.length / commentsPerPage);

  useEffect(function() {
    axios.get(`http://localhost:8000/posts/questions/comments/${question_id}`).then(function(res) {
      const comments = res.data;
      const promises = comments.map(function(comment) {
        return axios.get(`http://localhost:8000/users/getUsername/${comment.com_by}`).then(function(res) {
          comment.username = res.data;
          return comment;
        });
      });
      Promise.all(promises).then(function(results) {
        setCommentListObj([...results]);
      });
    });
  }, [question_id]);

  function handleNextClick() {
    setCurrentPage(currentPage === totalPages ? 1 : currentPage + 1);
  }
  

  function handleBackClick() {
    setCurrentPage(currentPage => currentPage === 1 ? totalPages : currentPage - 1);
  }
  

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


  async function upVoteButtonClicked(comment) {
    let userAlreadyVoted = comment.voters.filter(function(voter) {
      return voter.userVoted === userSession.userId;
    });
    if (userAlreadyVoted && userAlreadyVoted.direction !== 1) {
      await axios.patch(`http://localhost:8000/posts/questions/comments/incrementVotes/${comment._id}/${userSession.userId}`);
      updatePage(function() {
        return 'loading';
      });
      await sleep(10);
      updatePage(function() {
        return 'questions';
      });
    }
  }

  function renderPagination() {
    return currentcomments.length === 0
      ? null
      : React.createElement(
          'div',
          { className: 'pagination-comments' },
          React.createElement(
            'button',
            { className: 'pagination-button', disabled: currentPage === 1, onClick: handleBackClick },
            'Back'
          ),
          React.createElement(
            'button',
            { className: 'pagination-button', disabled: totalPages <= 1, onClick: handleNextClick },
            'Next'
          )
        );
  }
  

  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  
  async function addCommentToQuestion(commentText) {
    const commentType = 'question';
    const toId = question_id;
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
        updatePage(() => 'loading');
        await sleep(10);
        updatePage(() => 'questions');
        break;
      case 'User reputation too low':
        setCommentError('You cannot make a comment because your reputation is lower than 50');
        break;
      case 'Comment cannot be empty and no more than 140 characters':
        setCommentError('Comment cannot be empty and no more than 140 characters');
        break;
      default:
        // Handle any other cases here
        break;
    }
  }
  

  function renderNewCommentInput() {
    let component = null;
    
    switch (userSession.loggedIn) {
      case true:
        const handleCommentTextChange = (event) => {
          setCommentText(event.target.value);
        };
    
        const handleAddCommentClick = () => {
          addCommentToQuestion(commentText);
        };
    
        component = React.createElement(
          'div',
          { className: 'new-comment-input', style: { width: '80%', height: '240%', display: 'flex', alignItems: 'center' } },
          React.createElement('textarea', {
            className: 'new-comment-textarea',
            placeholder: 'Add a comment',
            value: commentText,
            onChange: handleCommentTextChange,
            style: { flex: '1', height: '100%', marginRight: '8px' }
          }),
          React.createElement(
            'button',
            { className: 'new-comment-button', onClick: handleAddCommentClick },
            'Add Comment'
          ),
          React.createElement('div', { className: 'comment-error' }, commentError)
        );
        
        break;
      default:
        component = null;
        break;
    }
  
    return component;
  }
  

  const commentList = currentcomments.map(function(element) {
    return React.createElement(
      'div',
      { key: element._id, className: 'comment-container' },
      React.createElement(
        'div',
        { className: 'vote-container' },
        React.createElement(
          'button',
          {
            disabled: !userSession.loggedIn || userSession.userId === element.com_by,
            onClick: () => upVoteButtonClicked(element),
            className: 'upvote-button',
          },
          'Upvote'
        ),
        React.createElement('div', { className: 'vote-counter' }, element.votes)
      ),
      React.createElement(
        'div',
        { className: 'comment-content-div' },
        React.createElement('p', null, parseContent(element.text))
      ),
      React.createElement(
        'div',
        { className: 'comment-metadata-div' },
        React.createElement('h4', { id: element.com_by }, 'commented By ', element.username, '\u00A0')
      )
    );
  });

  return React.createElement(
    React.Fragment,
    null,
    commentList,
    renderNewCommentInput(),
    renderPagination()
  );
}

export default CommentContainer;
