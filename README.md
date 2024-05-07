## Instructions to setup and run project

Have a background service of MongoDB running

Install dependencies in Client

$ cd client
$ npm install

Install dependencies in Server
$ cd ../server
$ npm install


# Make sure you are in the server directory
$ node init.js <email> <password>

# Example: node init.js admin@example.com admin

Run the server

# Make sure you are in the server directory
$ npm start <secret_key>

# Example: npm start secret
```

On a separate terminal, run the client

```bash
# Make sure you are in the client directory
$ npm start
```

## Other Information

Login Credentials

```
Email: user1@gmail.com
Password: abc123
Rep: 0

Email: user2@gmail.com
Password: abc123
Rep: 40

Email: user3@gmail.com
Password: abc123
Rep: 70
```

Deleting User Changes

- When an admin deletes a user and a tag is being used by others the owner of the tag is transferred to the admin

## Team Member 1 Contribution (Adam Khoukhi)

- Ported the codebase and set up the environment 
- Designed the UML Class Diagram
- Developled an inital script to populate the database
- Implemented the necessary modifications to the Question, Answers, and Tags data models
- Implemented Server Side Session Handling
- Added the Comments and Users data models
- Implemented the Welcome page (client & server side)
- Implemented the Login and SignUp functionality (client & server side)
- Implemented the Answer Page and Answer Question Pages (client & server side)
- Added 5 Answers for Page Functionality (Pagination)
- Implemented the Voting Functionality for Questions, Answers, and Comments (Client & Server Side)
- Added CSS for Welcome page components and Voting functionality
- Carried testing and fixed ESLint bugs

## Team Member 2 Contribution (Jason S. Wu)

- Implemented Add Comment functionality
- Added Error Handling for Add Comment
- Added General Error Handling
- Added 5 Questions for Page Functionality (Pagination)
- Search Functionality that Works With Sort Mode
- Added CSS for New Elements
- Create Middleware for Auth
- Added Client Sided Session Handling
- Editing Questions for A User
- Added Edit and Delete Tag Functionality
- Edit and Delete Answers
- Delete User
