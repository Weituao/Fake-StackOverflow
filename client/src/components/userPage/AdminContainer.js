import React, { useState, useEffect } from 'react';
import '../../stylesheets/UsersPage.css';
import axios from 'axios';

export default function AdminContainer({ updatePage, currentSession }) {
  useEffect(function() {
    window.scrollTo(0, 0);}, []);
  const [usersList, setUsersList] = useState([]);
  const [showWarning, setShowWarning] = useState({ warning: false, userId: '' });
  useEffect(function() {
    axios.get(`http://localhost:8000/users/admin`).then(function(res) {
      setUsersList([...res.data]); });}, []);
  function getTimeElapsedString(date) {
    const dwszrtvh = new Date();
    const rtyedf = dwszrtvh.getTime() - date.getTime();
    const ybjtrc = [
      { value: 1000, label: 'second' },
      { value: 60 * 1000, label: 'minute' },
      { value: 60 * 60 * 1000, label: 'hour' },
      { value: 24 * 60 * 60 * 1000, label: 'day' } ];
    const rtvybjrge = ybjtrc.find(unit => rtyedf < unit.value);
    const rteerfc = Math.floor(rtyedf / (rtvybjrge ? rtvybjrge.value : 1));
    const tyureg = rtvybjrge ? rtvybjrge.label : 'day';
    return `${rteerfc} ${tyureg}${rteerfc === 1 ? '' : 's'}`; }
  function displayUsers() {
    return usersList === 'error' ? (
      React.createElement('h1', { id: 'users-error-message' }, [
        'Error, please try again later',
        React.createElement('br', null),
        React.createElement('br', null),
        React.createElement('div', { onClick: () => window.location.reload(false) }, 'Return to Welcome Page')
      ])) : (
      React.createElement(React.Fragment, null, usersList.map(function(user) {
        const hergr = () => showWarning.warning ? rtvywex() : setShowWarning({ warning: true, userId: user._id });
        const yujnerfc = () => setShowWarning({ warning: false, userId: '' });
        const rtvywex = () => {
          const qwexrytv = showWarning.userId;
          axios.delete(`http://localhost:8000/users/deleteUser/${qwexrytv}`).then(res =>
            res.data === 'success'
              ? (
                setUsersList(usersList.filter(user => user._id !== qwexrytv)),
                setShowWarning({ warning: false, userId: '' }) )
              : alert('Error, please try again later') );};
        return React.createElement(React.Fragment, { key: user._id }, [
          React.createElement('div', { className: 'user-container', key: user._id + 'container' }, [
            React.createElement('button', {
              key: user._id + 'delete',
              disabled: user._id === currentSession.userId,
              onClick: hergr}, 'Delete'),
            React.createElement('h2', {
              key: user._id + 'username',
              onClick: () => updatePage({ currentPage: 'admin-user', userid: user._id })}, user._id === currentSession.userId ? user.username + ' (My Account)' : user.username)]),
          showWarning.userId === user._id && (
            React.createElement('div', { className: 'warning', key: user._id + 'warning' }, [
              React.createElement('p', { key: user._id + 'warningp' }, 'Delete User?'),
              React.createElement('button', { key: user._id + 'deleteUser', onClick: rtvywex }, 'Delete User'),
              React.createElement('button', { key: user._id + 'cancel', onClick: yujnerfc }, 'Cancel') ]) ), React.createElement('hr', { key: user._id + 'hr' }) ]);})));}
  
  return React.createElement('div', null, [
    usersList === 'error'
      ? (
        React.createElement('h1', { id: 'users-error-message' }, [
          'Error, please try again later',
          React.createElement('br', null),
          React.createElement('br', null),
          React.createElement('div', { onClick: () => window.location.reload(false) }, 'Return to Welcome Page') ]) )
      : (
        React.createElement('div', { id: 'upper-main', key: 'upper-main' }, [
          React.createElement('div', { className: 'user-top-container', key: 'user-top-container' }, [
            React.createElement('div', { className: 'user-header', key: 'user-header1' }, [
              React.createElement('h1', { key: 'welcome-header' }, 'Welcome back ' + currentSession.username + '!')]),
            React.createElement('div', { className: 'user-header', key: 'user-header2' }, [
              React.createElement('h2', { key: 'member-for' }, 'Member for ' + getTimeElapsedString(new Date(currentSession.created_at)))]),
            React.createElement('div', { className: 'user-header', key: 'user-header3' }, [
              React.createElement('h3', { key: 'reputation-score' }, 'Reputation Score: ' + currentSession.reputation) ]) ]) ]),React.createElement('div', { id: 'lower-main', key: 'lower-main' }, displayUsers()) )]);}
