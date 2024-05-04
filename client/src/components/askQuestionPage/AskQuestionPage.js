import React, { useEffect, useState } from 'react';
import '../../stylesheets/AskQuestionPage.css';
import validateHyperLinks from '../utils/validateHyperLinks';
import axios from 'axios';

function AskQuestionPage({ updatePage, currentSession, editInfo }) {
  const [hasError, setHasError] = useState({
    title: false,
    summary: null,
    content: null,
    tags: null,
    userId: false,
  });

  const [question, setQuestion] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '',
    userId: currentSession.userId,
  });

  useEffect(() => {
    switch (editInfo) {
      case true:
        setQuestion({
          title: editInfo.title,
          summary: editInfo.summary,
          content: editInfo.text,
          tags: editInfo.tags,
          userId: currentSession.userId,
        });
        break;
      default:
        // Do nothing or handle other cases if necessary
        break;
    }
  }, [editInfo, currentSession]);
  

  function setQuestionTitle(e) {
    setQuestion(Object.assign({}, question, { title: e.target.value.trim() }));
  }

  function setQuestionContent(e) {
    setQuestion(Object.assign({}, question, { content: e.target.value.trim() }));
  }

  function setQuestionTags(e) {
    setQuestion(Object.assign({}, question, { tags: e.target.value.trim() }));
  }

  function setQuestionSummary(e) {
    setQuestion(Object.assign({}, question, { summary: e.target.value.trim() }));
  }

  function validateQuestion() {
    let newStateHasError = { title: false, summary: null, content: null, tags: null, userId: false };
    let tags = question.tags.toLowerCase().split(' ');
    tags = tags.filter((tag) => tag.trim() !== '');
    switch (true) {
      case tags.length === 0:
        newStateHasError = Object.assign({}, newStateHasError, { tags: '*Question must have at least one tag' });
        break;
      // Add more cases if needed
      default:
        // Default case
        break;
    }
    
    switch (true) {
      case tags.length === 0:
        newStateHasError = Object.assign({}, newStateHasError, { tags: '*Question must have at least one tag' });
        break;
      case tags.length > 5:
        newStateHasError = Object.assign({}, newStateHasError, { tags: '*Question cannot have more than 5 tags' });
        break;
      case tags.some(tag => tag.length > 10):
        newStateHasError = Object.assign({}, newStateHasError, { tags: '*Tag cannot have more than 10 characters' });
        break;
      default:
        // No errors found
        break;
    }
    
    axios.get(`http://localhost:8000/posts/tags`, {}).then(function checkTagCreation(res) {
      let currentTagsList = res.data.map((tag) => tag.name);
      const noNewTags = tags.every((val) => currentTagsList.includes(val));
      switch (true) {
        case currentSession.reputation < 50 && !noNewTags:
          newStateHasError = Object.assign({}, newStateHasError, {
            tags: '*User must have atleast 50 reputation points to create a new tag.',
          });
          setHasError(newStateHasError);
          break;
        default:
          // No errors found
          break;
      }
      
    });

    switch (true) {
      case question.title === '':
        newStateHasError = Object.assign({}, newStateHasError, { title: true });
        break;
      case question.summary === '':
        newStateHasError = Object.assign({}, newStateHasError, { summary: '*Summary cannot be empty' });
        break;
      case question.summary.length > 140:
        newStateHasError = Object.assign({}, newStateHasError, { summary: '*Summary cannot have more than 140 characters' });
        break;
      case question.content === '':
        newStateHasError = Object.assign({}, newStateHasError, { content: '*Description field cannot be empty' });
        break;
      default:
        let foundError = validateHyperLinks(question.content);
        switch (foundError) {
          case true:
            newStateHasError = Object.assign({}, newStateHasError, {
              content: '*Constraints violated. The target of a hyperlink, that is, the stuff within () cannot be empty and must begin with “https://” or “http://”.',
            });
            break;
          default:
            // No error found, do nothing
            break;
        }
        break;
    }
    

    switch (question.userId === '') {
      case true:
        newStateHasError = Object.assign({}, newStateHasError, { userId: true });
        break;
      default:
        // userId is not empty, do nothing
        break;
    }
    

    setHasError(newStateHasError);
    switch (true) {
      case !newStateHasError.title &&
        newStateHasError.summary === null &&
        newStateHasError.content === null &&
        newStateHasError.tags === null &&
        !newStateHasError.userId:
        const newQuestion = {
          title: question.title,
          summary: question.summary,
          text: question.content,
          tagNames: tags,
          askedBy: currentSession.userId,
        };
    
        if (!editInfo) {
          axios
            .post('http://localhost:8000/posts/questions/askQuestion', newQuestion, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then(function handlePostQuestionResponse(res) {
              switch (true) {
                case res.data.error:
                  let newErrorState = {
                    title: false,
                    summary: null,
                    content: null,
                    tags: null,
                    userId: false,
                  };
                  newErrorState = Object.assign({}, newErrorState, {
                    tags: '*User must have atleast 50 reputation points to create a new tag.',
                  });
                  setHasError(newErrorState);
                  break;
                default:
                  updatePage('questions');
                  break;
              }
            });
        }
    
        if (editInfo) {
          axios
            .put(`http://localhost:8000/posts/questions/editQuestion/${editInfo._id}`, newQuestion, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then(function handleEditQuestionResponse(res) {
              switch (true) {
                case res.data.error:
                  let newErrorState = {
                    title: false,
                    summary: null,
                    content: null,
                    tags: null,
                    userId: false,
                  };
                  newErrorState = Object.assign({}, newErrorState, {
                    tags: '*User must have at least 50 reputation points to create a new tag.',
                  });
                  setHasError(newErrorState);
                  break;
                default:
                  updatePage('questions');
                  break;
              }
            });
        }
        break;
      default:
        break;
    }
    
  }

  return React.createElement(
    'div',
    { id: 'ask-question' },
    React.createElement('h2', null, 'Question Title*'),
    React.createElement('label', { htmlFor: 'title' }, 'Limit title to 50 characters or less'),
    React.createElement('input', {
      onChange: setQuestionTitle,
      type: 'text',
      className: 'new-q-input',
      id: 'new-title',
      name: 'title',
      maxLength: '50',
      defaultValue: editInfo ? editInfo.title : '',
    }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement('label', { htmlFor: 'title', className: 'new-q-error', id: 'title-error' }, hasError.title ? '*Title field cannot be empty' : ''),
    React.createElement('h2', null, 'Question Summary*'),
    React.createElement('label', { htmlFor: 'summary' }, 'Limit summary to 140 characters or less'),
    React.createElement('input', {
      onChange: setQuestionSummary,
      type: 'text',
      className: 'new-q-input',
      id: 'new-summary',
      name: 'summary',
      maxLength: '140',
      defaultValue: editInfo ? editInfo.summary : '',
    }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement(
      'label',
      { htmlFor: 'title', className: 'new-q-error', id: 'summary-error' },
      hasError.summary === null ? '' : hasError.summary
    ),
    React.createElement('h2', null, 'Question Text*'),
    React.createElement('label', { htmlFor: 'content' }, 'Add details'),
    React.createElement('textarea', {
      onChange: setQuestionContent,
      id: 'new-content',
      name: 'content',
      defaultValue: editInfo ? editInfo.text : '',
    }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement(
      'label',
      { htmlFor: 'title', className: 'new-q-error', id: 'content-error' },
      hasError.content === null ? '' : hasError.content
    ),
    React.createElement('h2', null, 'Tags*'),
    React.createElement('label', { htmlFor: 'tags' }, 'Add keywords separated by whitespace'),
    React.createElement('input', {
      onChange: setQuestionTags,
      type: 'text',
      className: 'new-q-input',
      id: 'new-tags',
      name: 'tags',
      defaultValue: editInfo ? editInfo.tags : '',
    }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement(
      'label',
      { htmlFor: 'title', className: 'new-q-error', id: 'tags-error' },
      hasError.tags === null ? '' : hasError.tags
    ),
    React.createElement('input', {
      type: 'submit',
      className: 'submit-question',
      value: 'Post Question',
      onClick: validateQuestion,
    }),
    React.createElement('h3', null, '* indicates mandatory fields')
  );
}

export default AskQuestionPage;
