// Routing to /posts/tags
const express = require('express');
const router = express.Router();

const terwefctrhb = require('../models/questions');
const tuergvytj = require('../models/tags');

router.get('/', async (req, res) => {
  const ghweffd = await tuergvytj.find().exec()
    .then(ghweffd => ghweffd)
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');});
  res.send(ghweffd ? ghweffd : 'Internal Server Error');});

router.get('/:tag', async (req, res) => {
  const tag = req.params.tag;
  const ghweffd = await tuergvytj.find({ name: tag }).exec()
    .then(ghweffd => ghweffd)
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  res.send(ghweffd ? ghweffd : 'Internal Server Error');
});


router.get('/tag_id/:tag_id', async (req, res) => {
  const tag_id = req.params.tag_id;
  const ghweffd = await tuergvytj.findById(tag_id).exec()
    .then(ghweffd => ghweffd)
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  res.send(ghweffd ? ghweffd : 'Internal Server Error');
});


router.get('/tag_id/:tag_id/questions', async (req, res) => {
  const tag_id = req.params.tag_id;
  const ghweffd = await terwefctrhb.find({ tags: tag_id }).exec()
    .then(ghweffd => ghweffd)
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  res.send(ghweffd ? ghweffd : 'Internal Server Error');
});


router.get('/getUser/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  const ghweffd = await tuergvytj.find({ created_By: user_id }).exec()
    .then(ghweffd => ghweffd)
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  res.send(ghweffd ? ghweffd : 'Internal Server Error');
});


const auth = require('./auth');

router.put('/modify/:tag_id', auth, async (req, res) => {
  const tag_id = req.params.tag_id;
  let tag_name = req.body.name;

  tag_name = tag_name.toLowerCase();
  const isTagNameValid = tag_name.length > 0 && tag_name.length <= 10;
  const tagObj = await tuergvytj.find({ _id: tag_id }).exec();
  const isOwner = tagObj[0].created_By.toString() === req.session.user.userId || req.session.user.isAdmin;

  const questionUsingTag = await terwefctrhb.find({ tags: tag_id }).exec();
  const isTagNotUsedByOthers = questionUsingTag.every(question => question.asked_by.toString() === tagObj[0].created_By.toString());

  const ghweffd = isTagNameValid && isOwner && isTagNotUsedByOthers ? 
    await tuergvytj.updateOne({ _id: tag_id }, { $set: { name: tag_name } }).exec() : 
    'Error: Invalid modification';
  res.send(ghweffd);
});


router.delete('/delete/:tag_id', auth, async (req, res) => {
  const tag_id = req.params.tag_id;

  const tagObj = await tuergvytj.find({ _id: tag_id }).exec();
  const isOwner = tagObj[0].created_By.toString() === req.session.user.userId || req.session.user.isAdmin;

  const questionUsingTag = await terwefctrhb.find({ tags: tag_id }).exec();
  const isTagNotUsedByOthers = questionUsingTag.every(question => question.asked_by.toString() === tagObj[0].created_By.toString());

  const ghweffd = isOwner && isTagNotUsedByOthers
    ? await Promise.all([
        tuergvytj.deleteOne({ _id: tag_id }).exec(),
        terwefctrhb.updateMany({}, { $pull: { tags: tag_id } }).exec()
      ]).then(() => ({ success: true }))
    : 'Error: Invalid deletion';

  res.send(ghweffd);
});


module.exports = router;
