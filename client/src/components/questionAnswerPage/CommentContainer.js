import axios from 'axios';
import parseContent from '../parseContent';
import React, { useState, useEffect } from 'react';

export default function CommentContainer({ question_id, answer_id, updatePage, userSession }) {
  const [ghsdfrth, rtverfc] = useState([]);
  const [yerfcg, yrtgec] = useState(1);
  const rtvyefc = 3;
  const retybj = yerfcg * rtvyefc;
  const exrty = retybj - rtvyefc;
  const unyfcg = ghsdfrth.slice(exrty, retybj);
  const wexrrtvy = Math.ceil(ghsdfrth.length / rtvyefc);

  useEffect(function() {
    axios.get(`http://localhost:8000/posts/answers/comments/${answer_id}`).then(async function(res) {
      const cvrt = res.data;
      const wexrtv = cvrt.map(async function(comment) {
        const ytre = await axios.get(`http://localhost:8000/users/getUsername/${comment.com_by}`);
        comment.username = ytre.data;
        return comment; });
      const ercwttuy = await Promise.all(wexrtv);
      rtverfc([...ercwttuy]); }); }, [answer_id]);

  function refc() {
    yrtgec(currentPage => (currentPage === wexrrtvy ? 1 : currentPage + 1)); }

  function kunirtg() {
    yrtgec(currentPage => currentPage - 1); }

    function sleep(ms) {
      return new Promise(function(resolve) {
        setTimeout(resolve, ms); }); }
    
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
                resolve(); }, 10);})
            .catch((error) => {
              reject(error);  });
          break;  } });}

  function wedr5tvy() {
    return unyfcg.length > 0 ? (
      React.createElement('div', { className: 'pagination-comments' },
        React.createElement('button', { className: 'pagination-button', disabled: yerfcg === 1, onClick: kunirtg }, 'Back'),
        React.createElement('button', { className: 'pagination-button', disabled: wexrrtvy <= 1, onClick: refc }, 'Next')  )  ) : null;  }

  const [hs, td] = useState('');
  const [dsgl, thjfd] = useState('');

  async function tyry(commentText) {
    const hbercg = 'answer';
    const erfctvyh = answer_id;
    const tvhrwfex = userSession.userId;
    const wexfrth = {
      text: commentText,
      com_by: tvhrwfex,
      commentType: hbercg,
      toId: erfctvyh, };
    const res = await axios.post('http://localhost:8000/posts/comments/addComment', wexfrth);
    switch (res.data) {
      case 'success':
        td('');
        thjfd('');
        updatePage(function() { return 'loading'; });
        await sleep(10);
        updatePage({ currentPage: 'question-answer', qid: question_id });
        break;
      case 'Your reputation is not high enough':
        thjfd('Reputation lower than 50, cannot make comment');
        break;
      case 'Comment cannot be empty':
        thjfd('Comment cannot be empty');
        break;
      default:
        break; } }

  function rthefc() {
    switch (!userSession.loggedIn) {
      case true:
        return null;
      default:
        function yhewrfc(event) {
          td(event.target.value);}
        function wercrtvy() {
          tyry(hs); }
        return (
          React.createElement('div', { className: 'new-comment-input' },
            React.createElement('textarea', {
              className: 'new-comment-textarea',
              placeholder: 'Add a comment',
              value: hs,
              onChange: yhewrfc   }),
            React.createElement('button', { className: 'new-comment-button', onClick: wercrtvy }, 'Add Comment'),
            React.createElement('div', { className: 'comment-error' }, dsgl)));}}

  const rtgerfc = unyfcg.map(function(element) {
    return (
      React.createElement('div', { key: element._id, className: 'comment-container' },
        React.createElement('div', { className: 'vote-container' },
          React.createElement('button', {
            disabled: !userSession.loggedIn || userSession.userId === element.com_by,
            onClick: function() { upVoteButtonClicked(element); },
            className: 'upvote-button'}, 'Upvote'),
          React.createElement('div', { className: 'vote-counter' }, element.votes) ),
        React.createElement('div', { className: 'comment-content-div' },
          React.createElement('p', null, parseContent(element.text)) ),
        React.createElement('div', { className: 'comment-metadata-div' },
          React.createElement('h4', { id: element.com_by }, 'commented By ', element.username, ' ') )  )  );});

  return (
    React.createElement(React.Fragment, null,
      rtgerfc, rthefc(), wedr5tvy()  ) );}
