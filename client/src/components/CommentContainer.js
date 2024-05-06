import axios from 'axios';
import parseContent from './parseContent';
import React, { useState, useEffect } from 'react';

export default function CommentContainer({ question_id, updatePage, userSession }) {
  const [tyhewf, setCommentListObj] = useState([]);
  const [tyjwef, setCurrentPage] = useState(1);
  const wexftjy = 3;
  const yukrge = tyjwef * wexftjy;
  const wexf5yhb = yukrge - wexftjy;
  const jytreg = tyhewf.slice(wexf5yhb, yukrge);
  const ercttvy = Math.ceil(tyhewf.length / wexftjy);

  useEffect(function() {
    axios.get(`http://localhost:8000/posts/questions/comments/${question_id}`).then(function(res) {
      const coms = res.data;
      const thrwef = coms.map(function(comment) {
        return axios.get(`http://localhost:8000/users/getUsername/${comment.com_by}`).then(function(res) {
          comment.username = res.data;
          return comment;});});
      Promise.all(thrwef).then(function(results) {
        setCommentListObj([...results]);});});}, [question_id]);

  function handleNextClick() {
    setCurrentPage(tyjwef === ercttvy ? 1 : tyjwef + 1);}
  
  function handleBackClick() {
    setCurrentPage(currentPage => currentPage === 1 ? ercttvy : currentPage - 1); }
  
  function sleep(ms) {
    return new Promise(function(resolve) {
      setTimeout(resolve, ms); });}

  async function rcetyhb(comment) {
    let ther = comment.voters.filter(function(voter) {
      return voter.userVoted === userSession.userId;});
    if (ther && ther.direction !== 1) {
      await axios.patch(`http://localhost:8000/posts/questions/comments/incrementVotes/${comment._id}/${userSession.userId}`);
      updatePage(function() {
        return 'loading';});
      await sleep(10);
      updatePage(function() {
        return 'questions';});} }

  function rtvhegrc() {
    return jytreg.length === 0
      ? null
      : React.createElement(
          'div',
          { className: 'pagination-comments' },
          React.createElement(
            'button',
            { className: 'pagination-button', disabled: tyjwef === 1, onClick: handleBackClick },
            'Back'),
          React.createElement(
            'button',
            { className: 'pagination-button', disabled: ercttvy <= 1, onClick: handleNextClick },
            'Next')); }
  
  const [cjf, setCommentText] = useState('');
  const [chg, setCommentError] = useState('');
  
  async function erfctyb(commentText) {
    const commentType = 'question';
    const toId = question_id;
    const com_by = userSession.userId;
    const newComment = {
      text: commentText,
      com_by: com_by,
      commentType: commentType,
      toId: toId,};
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
        setCommentError('User need 50 reputation or more to comment');
        break;
      case 'Comment cannot be empty':
        setCommentError('Comment cannot be empty');
        break;
      default:
        break;} }
  

  function yrtvwefc() {
    let hdgh = null;
    switch (userSession.loggedIn) {
      case true:
        const handleCommentTextChange = (event) => {
          setCommentText(event.target.value);   };
        const handleAddCommentClick = () => {
          erfctyb(cjf); };
        hdgh = React.createElement(
          'div',
          { className: 'new-comment-input', style: { width: '80%', height: '240%', display: 'flex', alignItems: 'center' } },
          React.createElement('textarea', {
            className: 'new-comment-textarea',
            placeholder: 'Add a comment',
            value: cjf,
            onChange: handleCommentTextChange,
            style: { flex: '1', height: '100%', marginRight: '8px' }}),
          React.createElement(
            'button',
            { className: 'new-comment-button', onClick: handleAddCommentClick },
            'Add Comment' ),
          React.createElement('div', { className: 'comment-error' }, chg) );
        break;
      default:
        hdgh = null;
        break;}
    return hdgh; }
  const tewg = jytreg.map(function(element) {
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
            onClick: () => rcetyhb(element),
            className: 'upvote-button',},
          'Upvote' ),
        React.createElement('div', { className: 'vote-counter' }, element.votes)),
      React.createElement(
        'div',
        { className: 'comment-content-div' },
        React.createElement('p', null, parseContent(element.text))
      ),
      React.createElement(
        'div',
        { className: 'comment-metadata-div' },
        React.createElement('h4', { id: element.com_by }, 'commented By ', element.username, '\u00A0')) ); });
  return React.createElement(
    React.Fragment,
    null,
    tewg,
    yrtvwefc(),
    rtvhegrc());}
