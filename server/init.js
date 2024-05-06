const bcrypt = require('bcrypt');
let userArgs = process.argv.slice(2);
if (userArgs.length < 2) {
  throw new Error('Must provide 2 Arguments: an email address and password for Admin.');}
let User = require('./models/users');

let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.dropDatabase();

function userCreate(username, email, password, isAdmin, created_at, reputation) {
  let user = new User({
    username: username,
    email: email,
    password: password,
    isAdmin: isAdmin,
    created_at: created_at,
    reputation: reputation,
  });
  return user.save();
}


const populate = async () => {
  const hashedPassword_admin = await bcrypt.hash(userArgs[1], 10);
  let admin_user = await userCreate(`Admin`, userArgs[0], hashedPassword_admin, true, new Date(), 1000);
  admin_user.save();

  const users = [];
  const reputations = [0, 40, 70];
  for (let i = 1; i <= 3; i++) {
    const username = `user${i}`;
    const email = `user${i}@gmail.com`;
    const password = 'abc123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = false;
    const created_at = new Date();
    const reputation = reputations[i - 1];
    let user = await userCreate(username, email, hashedPassword, isAdmin, created_at, reputation);
    users.push(user);
  }

  if (db) db.close();
  console.log('done');
};
populate()
console.log('processing ...');
