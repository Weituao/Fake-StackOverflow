import React from 'react';
import '../stylesheets/UsersPage.css';
import UserContainer from './UserContainer';
import AdminContainer from './userPage/AdminContainer';

export default function UserPage({ updatePage, currentSession }) {
  return React.createElement(
    React.Fragment,
    null,
    currentSession.loggedIn
      ? currentSession.isAdmin
        ? React.createElement(AdminContainer, { updatePage: updatePage, currentSession: currentSession })
        : React.createElement(UserContainer, { userid: currentSession.userId, updatePage: updatePage })
      : React.createElement('div', { id: 'users-error-message' }, 'Please login to view this page') );}