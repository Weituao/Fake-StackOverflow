// Routing to /posts/users
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/users');
const Answer = require('../models/answers');
const Question = require('../models/questions');
const Comment = require('../models/comments');
const Tag = require('../models/tags');

router.post('/signUp', async (req, res) => {
  let newUser = req.body;

  let emailFound;
  User.findOne({ email: newUser.email })
    .then((found) => {
      emailFound = found;
      return emailFound ? Promise.reject('An account with that email address already exists.') : bcrypt.hash(newUser.password, 10);
    })
    .then((hashedPassword) => {
      let user = new User({
        username: newUser.username,
        email: newUser.email,
        password: hashedPassword,
        isAdmin: false,
      });
      return user.save();
    })
    .then(() => {
      res.status(200).send('success');
    })
    .catch((err) => {
      console.log(err);
      res.send(!emailFound ? 'Internal Server Error occurred while saving the user. Please try again.' : 'Internal Server Error occurred while hashing the password. Please try again.');
    });
});

router.post('/logIn', async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({ email: email }).exec()
    .then(userFound => {
      return !userFound ?
        res.send('An account with the given Email Address does not exist.') :
        bcrypt.compare(password, userFound.password)
          .then(isMatch => {
            return isMatch ?
              (req.session.user = {
                loggedIn: true,
                username: userFound.username,
                email: userFound.email,
                userId: userFound._id,
                reputation: userFound.reputation,
                created_at: userFound.created_at,
                isAdmin: userFound.isAdmin,
              },
              res.send('success')) :
              res.send('Incorrect password. Please try again.');
          });
    })
    .catch(err => {
      console.log(err);
      res.send('Internal Server Error occurred. Please try again.');
    });
});


router.get('/session', (req, res) => {
  res.send(req.session.user ? req.session.user : 'Session not found');
});


router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    err ? res.send(err) : res.send('success');
  });
});


router.get('/admin', (req, res) => {
  User.find({}).exec()
    .then(users => res.send(users.map(user => ({ ...user.toObject(), password: undefined }))))
    .catch(err => res.send('Internal Server Error occurred. Please try again.'));
});


router.get('/getUsername/:id', (req, res) => {
  User.findById(req.params.id).exec()
    .then(user => res.send(user ? user.username : 'User not found'))
    .then(null, () => res.send('Internal Server Error occurred. Please try again.'));
});


router.get('/getUserData/:id', (req, res) => {
  User.findById(req.params.id).exec()
    .then(user => res.send(user ? (user.password = undefined, user) : 'User not found'))
    .catch(() => res.send('Internal Server Error occurred. Please try again.'));
});


router.delete('/deleteUser/:id', async (req, res) => {
  req.session.user.isAdmin ? (
    await (async () => {
      try {
        const questions = await Question.find({ asked_by: req.params.id }).exec();
        await Promise.all(questions.map(async (question) => {
          await Promise.all(question.answers.map(async (answer) => {
            try {
              await Answer.findByIdAndDelete(answer).exec();
            } catch (err) {
              console.log(err);
              res.send('Internal Server Error occurred. Please try again.');
            }
          }));
          await Promise.all(question.comments.map(async (comment) => {
            try {
              await Comment.findByIdAndDelete(comment).exec();
            } catch (err) {
              console.log(err);
              res.send('Internal Server Error occurred. Please try again.');
            }
          }));
        }));
        await Question.deleteMany({ asked_by: req.params.id }).exec();
        await Answer.deleteMany({ ans_by: req.params.id }).exec();
        await Comment.deleteMany({ com_by: req.params.id }).exec();
        const tags = await Tag.find({ created_By: req.params.id }).exec();
        await Promise.all(tags.map(async (tag) => {
          let shouldDeleteTag = true;
          const questionUsingTag = await Question.find({ tags: tag._id.toString() }).exec();
          if (questionUsingTag.some(question => question.asked_by.toString() !== tag.created_By.toString())) {
            shouldDeleteTag = false;
          }
          shouldDeleteTag ? (
            await (async () => {
              try {
                await Tag.deleteOne({ _id: tag._id }).exec();
              } catch (err) {
                console.log(err);
                res.send('Internal Server Error occurred. Please try again.');
              }
            })()
          ) : (
            await (async () => {
              try {
                await Tag.updateOne({ _id: tag._id }, { $set: { created_By: req.session.user.userId } }).exec();
              } catch (err) {
                console.log(err);
                res.send('Internal Server Error occurred. Please try again.');
              }
            })()
          );
        }));
        try {
          await User.findByIdAndDelete(req.params.id).exec();
          res.send('success');
        } catch (err) {
          console.log(err);
          res.send('Internal Server Error occurred. Please try again.');
        }
        return;
      } catch (err) {
        console.log(err);
        res.send('Internal Server Error occurred. Please try again.');
      }
    })()
  ) : (
    res.send('You do not have permission to delete users.')
  );
});


module.exports = router;
