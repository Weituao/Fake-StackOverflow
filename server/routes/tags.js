// Routing to /posts/tags
const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Tags = require('../models/tags');

router.get('/', async (req, res) => {
  const result = await Tags.find().exec()
    .then(result => result)
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  res.send(result ? result : 'Internal Server Error');
});


router.get('/:tag', async (req, res) => {
  const tag = req.params.tag;
  const result = await Tags.find({ name: tag }).exec()
    .then(result => result)
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  res.send(result ? result : 'Internal Server Error');
});


router.get('/tag_id/:tag_id', async (req, res) => {
  const tag_id = req.params.tag_id;
  const result = await Tags.findById(tag_id).exec()
    .then(result => result)
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  res.send(result ? result : 'Internal Server Error');
});


router.get('/tag_id/:tag_id/questions', async (req, res) => {
  const tag_id = req.params.tag_id;
  const result = await Questions.find({ tags: tag_id }).exec()
    .then(result => result)
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  res.send(result ? result : 'Internal Server Error');
});


router.get('/getUser/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  const result = await Tags.find({ created_By: user_id }).exec()
    .then(result => result)
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  res.send(result ? result : 'Internal Server Error');
});


const auth = require('../middleware/auth');

router.put('/modify/:tag_id', auth, async (req, res) => {
  const tag_id = req.params.tag_id;
  let tag_name = req.body.name;

  tag_name = tag_name.toLowerCase();
  const isTagNameValid = tag_name.length > 0 && tag_name.length <= 10;
  const tagObj = await Tags.find({ _id: tag_id }).exec();
  const isOwner = tagObj[0].created_By.toString() === req.session.user.userId || req.session.user.isAdmin;

  const questionUsingTag = await Questions.find({ tags: tag_id }).exec();
  const isTagNotUsedByOthers = questionUsingTag.every(question => question.asked_by.toString() === tagObj[0].created_By.toString());

  const result = isTagNameValid && isOwner && isTagNotUsedByOthers ? 
    await Tags.updateOne({ _id: tag_id }, { $set: { name: tag_name } }).exec() : 
    'Error: Invalid modification';
  res.send(result);
});


router.delete('/delete/:tag_id', auth, async (req, res) => {
  const tag_id = req.params.tag_id;

  const tagObj = await Tags.find({ _id: tag_id }).exec();
  const isOwner = tagObj[0].created_By.toString() === req.session.user.userId || req.session.user.isAdmin;

  const questionUsingTag = await Questions.find({ tags: tag_id }).exec();
  const isTagNotUsedByOthers = questionUsingTag.every(question => question.asked_by.toString() === tagObj[0].created_By.toString());

  const result = isOwner && isTagNotUsedByOthers
    ? await Promise.all([
        Tags.deleteOne({ _id: tag_id }).exec(),
        Questions.updateMany({}, { $pull: { tags: tag_id } }).exec()
      ]).then(() => ({ success: true }))
    : 'Error: Invalid deletion';

  res.send(result);
});


module.exports = router;
