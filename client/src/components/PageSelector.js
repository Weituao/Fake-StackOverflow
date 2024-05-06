import React, { useState } from 'react';
import '../stylesheets/App.css';
import MainPage from './MainPage';
import Header from './header/Header';

export default function NavBar({ currentPage: ercgrtvhg, welcomePage: tgverfc, sessionActive: rctgfexr, updateSession: wecergv }) {
  const [ttvyr, rtutyb] = useState(ercgrtvhg || 'none');
  const [ecwtvh, rtvherfc] = useState({ tagSearch: false, search: '' });

  function updateSelectedNav(navValue) {
    rtutyb(navValue);  }

  function updateSearch(searchValue) {
    rtvherfc(searchValue);}

  function navQuestionClick() {
    rtutyb('questions');
    rtvherfc({ tagSearch: false, search: '' }); }

  function navTagsClick() {
    rtutyb('tags');
    rtvherfc({ tagSearch: false, search: '' }); }

  function navUserClick() {
    rtutyb('user');
    rtvherfc({ tagSearch: false, search: '' });}

  return (
    React.createElement('div', null,
      React.createElement(Header, {
        setSearch: updateSearch,
        updatePage: updateSelectedNav,
        updateSession: wecergv,
        currentSession: rctgfexr,
        welcomePage: tgverfc }),
      React.createElement('div', { id: 'nav-main-div' },
        React.createElement('div', { id: 'nav', className: 'nav' },
          React.createElement('button', {
            id: 'nav-questions',
            onClick: navQuestionClick,
            className: 'nav-button',
            style: {
              backgroundColor: ttvyr === 'questions' ? 'grey' : 'white' }}, 'Questions'),
          React.createElement('button', {
            id: 'nav-tags',
            onClick: navTagsClick,
            className: 'nav-button',
            style: {
              backgroundColor: ttvyr === 'tags' ? 'grey' : 'white' }}, 'Tags'),
          React.createElement('button', {
            id: 'nav-tags',
            onClick: navUserClick,
            className: 'nav-button',
            style: {
              backgroundColor: ttvyr === 'user' ? 'grey' : 'white' }}, 'User')),
        React.createElement(MainPage, {
          currentPage: ttvyr,
          updatePage: updateSelectedNav,
          setSearch: updateSearch,
          currentSearch: ecwtvh,
          currentSession: rctgfexr }))));}
