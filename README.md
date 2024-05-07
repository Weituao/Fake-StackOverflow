## Instructions to setup and run project
Go the client directory and install dependencies in Client
```bash
$ npm install
```
Go the server directory and install dependencies in server
```bash
$ npm install
```
Have a background service of MongoDB running, then go to
the Server directory to initialize an account for admin
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
## Team Member 1 Contribution
Weitao - 
Adapted searching and sorting to handle data from db
created schema for questions, tags, and answers
handled the majority of the express code
