import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function TagsWrapper({ updatePage, setSearch, tags, username, userid }) {
  const gett = function(element) {
    setSearch({ tagSearch: true, search: '[' + element + ']' });
    updatePage('questions');};
  const [gergrhreg, rtverfch] = useState({});
  const [tuyrf, rtwexf] = useState({ tagId: null, tagName: null, edit: false });
  const [tybjerfc, wedxtybj] = useState({ tagId: null, tagName: null, delete: false });
  
  useEffect(function() {
    const yhjdf = async function() {
      const yhbtwexfc = {};
      let i = 0;
      while (i < tags.length) {
        const wedxrht = await axios.get(`http://localhost:8000/posts/tags/tag_id/${tags[i]._id}/questions`);
        yhbtwexfc[tags[i]._id] = wedxrht.data ? wedxrht.data.length : 0;
        i++;}
      rtverfch(yhbtwexfc);};
    yhjdf(); }, [tags]);
  
    return React.createElement(
    'ul',
    { id: 'tags-wrapper' },
    tags.map(function(element) {
      function thej() {
        rtwexf({ tagId: element._id, tagName: element.name, edit: true, error: false, errorMessage: '' }); }
      function trce() {
        return React.createElement(
          'form',
          { onSubmit: her },
          React.createElement('input', { type: 'text', value: tuyrf.tagName, onChange: yuretv }),
          React.createElement('input', { type: 'submit', value: 'Submit' }));}
      function yuretv(e) {
        rtwexf({ ...tuyrf, tagName: e.target.value });}
      function her(e) {
        e.preventDefault();
        const utybrceg = { name: tuyrf.tagName };
        axios.put(`http://localhost:8000/posts/tags/modify/${tuyrf.tagId}`, utybrceg).then(function(res) {
          typeof res.data === 'string'
            ? rtwexf({ ...tuyrf, error: true, errorMessage: res.data })
            : axios.get(`http://localhost:8000/posts/tags/getUser/${userid}`).then(function(res) {
                updatePage({ currentPage: 'tags', tags: res.data, username: username, userid: userid });
                rtwexf({ tagId: null, tagName: null, edit: false });   });}); }
      function rghwedf() {
        return React.createElement(
          'div',
          null,
          React.createElement('p', null, `Are you sure you want to delete ${tybjerfc.tagName}?`),
          React.createElement('button', { onClick: wrexvyer }, 'Yes'),
          React.createElement('button', { onClick: tybjdfcg }, 'No') );}
      function wrexvyer() {
        axios.delete(`http://localhost:8000/posts/tags/delete/${tybjerfc.tagId}`).then(function(res) {
          typeof res.data === 'string'
            ? wedxtybj({ ...tybjerfc, error: true, errorMessage: res.data })
            : axios.get(`http://localhost:8000/posts/tags/getUser/${userid}`).then(function(res) {
                updatePage({ currentPage: 'tags', tags: res.data, username: username, userid: userid });
                wedxtybj({ tagId: null, tagName: null, delete: false });});});}
      function tybjdfcg() {
        wedxtybj({ tagId: null, tagName: null, delete: false, error: false, errorMessage: '' });}
      function wexftybj() {
        wedxtybj({ tagId: element._id, tagName: element.name, delete: true });}
      return React.createElement('li', { key: element._id, className: 'tag-container' }, [
        React.createElement('div', { className: 'tag-name-div' }, [
          React.createElement('h2', null, [
            React.createElement('a', {
              href: element._id,
              id: element._id,
              onClick: (e) => {
                e.preventDefault();
                gett(element.name); }  }, element.name) ])]),
        React.createElement('div', { className: 'tag-num-questions-div' }, [
          React.createElement('h4', null, [
            gergrhreg[element._id] ?? 'Loading...',
            ' ',
            gergrhreg[element._id] === 1 ? 'question' : 'questions' ]) ]),
        username ? React.createElement('div', null, [
          React.createElement('button', { onClick: thej }, 'Edit'),
          React.createElement('button', { onClick: wexftybj }, 'Delete') ]) : null,
        tuyrf.tagId === element._id && tuyrf.edit ? trce() : null,
        tuyrf.tagId === element._id && tuyrf.error ? React.createElement('p', null, tuyrf.errorMessage) : null,
        tybjerfc.tagId === element._id && tybjerfc.delete ? rghwedf() : null,
        tybjerfc.tagId === element._id && tybjerfc.error ? React.createElement('p', null, tybjerfc.errorMessage) : null ]); }));}
