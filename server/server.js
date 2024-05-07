const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'PATCH'],
    credentials: true,}));

app.use(express.json());
const port = 8000;
let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(
  session({
    secret: "secretKey",
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 5 * 60 },
    resave: false,
    saveUninitialized: false,}));

app.use(cookieParser());
let db = mongoose.connection;
db.on('error', (err) => console.log(`Error Connecting: ${err}`));
db.on('connected', () => console.log('Connected to database'));
process.on('SIGINT', async () => {
  await (db ?
    db.close()
      .then(() => console.log('Server closed. Database instance disconnected'))
      .catch((err) => console.log(err))
    : Promise.resolve()
  );
  process.exit(0);});
const gerg = require('./routes/questions.js');
const therfw = require('./routes/answers.js');
const jkjrt = require('./routes/tags.js');
const hjrg = require('./routes/users.js');
const edthuj = require('./routes/comments.js');

app.use('/posts/questions', gerg);
app.use('/posts/answers', therfw);
app.use('/posts/tags', jkjrt);
app.use('/posts/comments', edthuj);
app.use('/users/', hjrg);
app.get('/posts', (req, res) => {
  res.redirect('/posts/questions');});

app.listen(port, () => console.log(`listening on port ${port}`));
