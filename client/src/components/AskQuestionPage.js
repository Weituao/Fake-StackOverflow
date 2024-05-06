import React, { useEffect, useState } from 'react';
import '../stylesheets/AskQuestionPage.css';
import validateHyperLinks from './validateHyperLinks';
import axios from 'axios';

export default function AskQuestionPage({ updatePage, currentSession, editInfo }) {
  const [hasError, setHasError] = useState({
    title: false, summary: null, content: null,   tags: null,  userId: false,});

  const [question, setQuestion] = useState({
    title: '',summary: '', content: '',tags: '', userId: currentSession.userId,});

  useEffect(() => {
    switch (editInfo) {
      case true:
        setQuestion({
          title: editInfo.title,
          summary: editInfo.summary,
          content: editInfo.text,
          tags: editInfo.tags,
          userId: currentSession.userId, });
        break;
      default:
        break;} }, [editInfo, currentSession]);

  function ujyhg(e) {
    setQuestion(Object.assign({}, question, { title: e.target.value.trim() }));}

  function erthfg(e) {
    setQuestion(Object.assign({}, question, { content: e.target.value.trim() }));}

  function wergf(e) {
    setQuestion(Object.assign({}, question, { tags: e.target.value.trim() }));}

  function iuy(e) {
    setQuestion(Object.assign({}, question, { summary: e.target.value.trim() }));
  }

  function notgoodq() {
    let tyjewftrh = { title: false, summary: null, content: null, tags: null, userId: false };
    let tags = question.tags.toLowerCase().split(' ');
    tags = tags.filter((tag) => tag.trim() !== '');
    switch (true) {
      case tags.length === 0:
        tyjewftrh = Object.assign({}, tyjewftrh, { tags: 'Must have at least one tag' });
        break;
      default:
        break; }
    
    switch (true) {
      case tags.length === 0:
        tyjewftrh = Object.assign({}, tyjewftrh, { tags: 'Must have at least one tag' });
        break;
      case tags.length > 5:
        tyjewftrh = Object.assign({}, tyjewftrh, { tags: 'Cannot have more than 5 tags' });
        break;
      case tags.some(tag => tag.length > 20):
        tyjewftrh = Object.assign({}, tyjewftrh, { tags: 'Tags cannot have more than 20 characters' });
        break;
      default:
        break;}
    
    axios.get(`http://localhost:8000/posts/tags`, {}).then(function checkTagCreation(res) {
      let rtyh = res.data.map((tag) => tag.name);
      const noNewTags = tags.every((val) => rtyh.includes(val));
      switch (true) {
        case currentSession.reputation < 50 && !noNewTags:
          tyjewftrh = Object.assign({}, tyjewftrh, {
            tags: 'User must have 50 reputation or more to add new tag', });
          setHasError(tyjewftrh);
          break;
        default:
          break; }});

    switch (true) {
      case question.title === '':
        tyjewftrh = Object.assign({}, tyjewftrh, { title: true });
        break;
      case question.summary === '':
        tyjewftrh = Object.assign({}, tyjewftrh, { summary: 'Summary cannot be empty' });
        break;
      case question.summary.length > 140:
        tyjewftrh = Object.assign({}, tyjewftrh, { summary: 'Summary cannot have more than 140 characters' });
        break;
      case question.content === '':
        tyjewftrh = Object.assign({}, tyjewftrh, { content: 'Description cannot be empty' });
        break;
      default:
        let fgh = validateHyperLinks(question.content);
        switch (fgh) {
          case true:
            tyjewftrh = Object.assign({}, tyjewftrh, {
              content: 'Hyperlink cannot be empty and must start with http:// or https://',
            });
            break;
          default:
            break;
        }
        break;
    }
    

    switch (question.userId === '') {
      case true:
        tyjewftrh = Object.assign({}, tyjewftrh, { userId: true });
        break;
      default:
        break;}
    

    setHasError(tyjewftrh);
    switch (true) {
      case !tyjewftrh.title &&
        tyjewftrh.summary === null &&
        tyjewftrh.content === null &&
        tyjewftrh.tags === null &&
        !tyjewftrh.userId:
        const newQuestion = {
          title: question.title,
          summary: question.summary,
          text: question.content,
          tagNames: tags,
          askedBy: currentSession.userId,};
        if (!editInfo) {
          axios
            .post('http://localhost:8000/posts/questions/askQuestion', newQuestion, {
              headers: {
                'Content-Type': 'application/json', }, })
            .then(function handlePostQuestionResponse(res) {
              switch (true) {
                case res.data.error:
                  let newErrorState = {
                    title: false,
                    summary: null,
                    content: null,
                    tags: null,
                    userId: false,   };
                  newErrorState = Object.assign({}, newErrorState, {
                    tags: '*User must have atleast 50 reputation points to create a new tag', });
                  setHasError(newErrorState);
                  break;
                default:
                  updatePage('questions');
                  break; } });  }
        if (editInfo) {
          axios
            .put(`http://localhost:8000/posts/questions/editQuestion/${editInfo._id}`, newQuestion, {
              headers: {
                'Content-Type': 'application/json', }, })
            .then(function handleEditQuestionResponse(res) {
              switch (true) {
                case res.data.error:
                  let newErrorState = {
                    title: false,
                    summary: null,
                    content: null,
                    tags: null,
                    userId: false, };
                  newErrorState = Object.assign({}, newErrorState, {
                    tags: '*User must have at least 50 reputation points to create a new tag.', });
                  setHasError(newErrorState);
                  break;
                default:
                  updatePage('questions');
                  break;  }}); }
        break;
      default:
        break; } }

  return React.createElement(
    'div',
    { id: 'ask-question' },
    React.createElement('h2', null, 'Question Title*'),
    React.createElement('label', { htmlFor: 'title' }, 'Limit title to 50 characters or less'),
    React.createElement('input', {
      onChange: ujyhg,
      type: 'text',
      className: 'new-q-input',
      id: 'new-title',
      name: 'title',
      maxLength: '50',
      defaultValue: editInfo ? editInfo.title : '', }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement('label', { htmlFor: 'title', className: 'new-q-error', id: 'title-error' }, hasError.title ? '*Title cannot be empty' : ''),
    React.createElement('h2', null, 'Question Summary*'),
    React.createElement('label', { htmlFor: 'summary' }, 'Limit summary to 140 characters or less'),
    React.createElement('input', {
      onChange: iuy,
      type: 'text',
      className: 'new-q-input',
      id: 'new-summary',
      name: 'summary',
      maxLength: '140',
      defaultValue: editInfo ? editInfo.summary : '', }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement(
      'label',
      { htmlFor: 'title', className: 'new-q-error', id: 'summary-error' },
      hasError.summary === null ? '' : hasError.summary  ),
    React.createElement('h2', null, 'Question Text*'),
    React.createElement('label', { htmlFor: 'content' }, 'Add details'),
    React.createElement('textarea', {
      onChange: erthfg,
      id: 'new-content',
      name: 'content',
      defaultValue: editInfo ? editInfo.text : '',}),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement(
      'label',
      { htmlFor: 'title', className: 'new-q-error', id: 'content-error' },
      hasError.content === null ? '' : hasError.content ),
    React.createElement('h2', null, 'Tags*'),
    React.createElement('label', { htmlFor: 'tags' }, 'Add keywords separated by whitespace'),
    React.createElement('input', {
      onChange: wergf,
      type: 'text',
      className: 'new-q-input',
      id: 'new-tags',
      name: 'tags',
      defaultValue: editInfo ? editInfo.tags : '', }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement(
      'label',
      { htmlFor: 'title', className: 'new-q-error', id: 'tags-error' },
      hasError.tags === null ? '' : hasError.tags),
    React.createElement('input', {
      type: 'submit',
      className: 'submit-question',
      value: 'Post Question',
      onClick: notgoodq,}),);}

