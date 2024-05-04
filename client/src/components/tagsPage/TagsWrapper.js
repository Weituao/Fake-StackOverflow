import axios from 'axios';
import React, { useState, useEffect } from 'react';

function TagsWrapper({ updatePage, setSearch, tags, username, userid }) {
  const searchForTag = function(element) {
    setSearch({ tagSearch: true, search: '[' + element + ']' });
    updatePage('questions');
  };

  const [tagQuestionsCount, setTagQuestionsCount] = useState({});
  const [editTag, setEditTag] = useState({ tagId: null, tagName: null, edit: false });
  const [deleteTag, setDeleteTag] = useState({ tagId: null, tagName: null, delete: false });

  useEffect(function() {
    const fetchTagQuestionsCount = async function() {
      const countObj = {};
      let i = 0;
      while (i < tags.length) {
        const res = await axios.get(`http://localhost:8000/posts/tags/tag_id/${tags[i]._id}/questions`);
        countObj[tags[i]._id] = res.data ? res.data.length : 0;
        i++;
      }
      setTagQuestionsCount(countObj);
    };
    fetchTagQuestionsCount();
  }, [tags]);
  

  return React.createElement(
    'ul',
    { id: 'tags-wrapper' },
    tags.map(function(element) {
      function editTagClicked() {
        setEditTag({ tagId: element._id, tagName: element.name, edit: true, error: false, errorMessage: '' });
      }
  
      function createEditTagForm() {
        return React.createElement(
          'form',
          { onSubmit: editTagSubmit },
          React.createElement('input', { type: 'text', value: editTag.tagName, onChange: editTagChange }),
          React.createElement('input', { type: 'submit', value: 'Submit' })
        );
      }
  
      function editTagChange(e) {
        setEditTag({ ...editTag, tagName: e.target.value });
      }
  
      function editTagSubmit(e) {
        e.preventDefault();
        const data = { name: editTag.tagName };
        axios.put(`http://localhost:8000/posts/tags/modify/${editTag.tagId}`, data).then(function(res) {
          typeof res.data === 'string'
            ? setEditTag({ ...editTag, error: true, errorMessage: res.data })
            : axios.get(`http://localhost:8000/posts/tags/getUser/${userid}`).then(function(res) {
                updatePage({ currentPage: 'tags', tags: res.data, username: username, userid: userid });
                setEditTag({ tagId: null, tagName: null, edit: false });
              });
        });
      }
  
      function createDeleteWarn() {
        return React.createElement(
          'div',
          null,
          React.createElement('p', null, `Are you sure you want to delete ${deleteTag.tagName}?`),
          React.createElement('button', { onClick: deleteTagSubmit }, 'Yes'),
          React.createElement('button', { onClick: deleteTagCancel }, 'No')
        );
      }
  
      function deleteTagSubmit() {
        axios.delete(`http://localhost:8000/posts/tags/delete/${deleteTag.tagId}`).then(function(res) {
          typeof res.data === 'string'
            ? setDeleteTag({ ...deleteTag, error: true, errorMessage: res.data })
            : axios.get(`http://localhost:8000/posts/tags/getUser/${userid}`).then(function(res) {
                updatePage({ currentPage: 'tags', tags: res.data, username: username, userid: userid });
                setDeleteTag({ tagId: null, tagName: null, delete: false });
              });
        });
      }
  
      function deleteTagCancel() {
        setDeleteTag({ tagId: null, tagName: null, delete: false, error: false, errorMessage: '' });
      }
  
      function deleteTagClicked() {
        setDeleteTag({ tagId: element._id, tagName: element.name, delete: true });
      }
  
      return React.createElement(
        'li',
        { key: element._id, className: 'tag-container' },
        React.createElement(
          'div',
          { className: 'tag-name-div' },
          React.createElement(
            'h2',
            null,
            React.createElement(
              'a',
              {
                href: element._id,
                id: element._id,
                onClick: function(e) {
                  e.preventDefault();
                  searchForTag(element.name);
                },
              },
              element.name
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'tag-num-questions-div' },
          React.createElement(
            'h4',
            null,
            tagQuestionsCount[element._id] ? tagQuestionsCount[element._id] + ' ' : 'Loading...',
            tagQuestionsCount[element._id] === 1 ? 'question' : 'questions'
          )
        ),
        username
          ? React.createElement(
              'div',
              null,
              React.createElement('button', { onClick: editTagClicked }, ' Edit '),
              React.createElement('button', { onClick: deleteTagClicked }, ' Delete ')
            )
          : null,
        editTag.tagId === element._id && editTag.edit ? createEditTagForm() : null,
        editTag.tagId === element._id && editTag.error ? React.createElement('p', null, editTag.errorMessage) : null,
        deleteTag.tagId === element._id && deleteTag.delete ? createDeleteWarn() : null,
        deleteTag.tagId === element._id && deleteTag.error ? React.createElement('p', null, deleteTag.errorMessage) : null
      );
    })
  );
}

export default TagsWrapper;
