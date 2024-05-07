## Instructions to setup and run project
Install dependencies in Client

```bash
$ cd client
$ npm install
```
Install dependencies in Server

```bash
$ cd ../server
$ npm install
```

Have a background service of MongoDB running
Be in Server directory to initialize an account for admin
```bash
$ node init.js <email> <password>
# Example: node init.js admin@example.com admin
```

Run the server
```bash
$ npm start
```

Open another terminal, and go to client directory

```bash
$ npm start
```

## Other Information

Login Credentials

```
Email: user1@gmail.com
Password: abc123
Rep: 0

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
