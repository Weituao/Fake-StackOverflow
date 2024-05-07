const express = require('express');
const router = express.Router();
const Questions  = require('../models/questions');
const Answers  = require('../models/answers');
const Users  = require('../models/users');
const Comments  = require('../models/comments');
const auth = require('./auth');

router.get('/:qid', async function(req, res) {
  const mqfq = await Questions .findById(req.params.qid).exec();
  if (!mqfq) {
    return res.status(404).send('Question not found');}
  const mafa = await Answers .find({ _id: { $in: mqfq.answers } }).sort({ ans_date_time: -1 }).exec();
  res.send(mafa);});

router.get('/comments/:answer_id', async function(req, res) {
  const mafa = await Answers .findById(req.params.answer_id).exec();
  if (!mafa) {
    return res.status(404).send('Answer not found');}
  const mcfc = await Comments .find({ _id: { $in: mafa.comments } }).sort({ com_date_time: -1 }).exec();
  res.send(mcfc);});

router.get('/getQuestionsAnswered/:user_id', async function(req, res) {
  const anau = await Answers .find({ ans_by: req.params.user_id }).exec();
  const fqf = await Questions .find({ answers: { $in: anau } }).sort({ ask_date_time: -1 }).exec();
  res.send(fqf);});

router.use(auth); 

router.post('/answerQuestion', async function(req, res) {
  let anqa = req.body;
  anqa.ans_by = req.session.user.userId;
  const naq = new Answers ({
    text: anqa.text,
    ans_by: anqa.ans_by,});
  await naq.save();
  const nqaf = await Questions .findById(anqa.qid).exec();
  const fssd = nqaf
    ? (nqaf.answers.push(naq._id), await nqaf.save(), nqaf)
    : res.status(404).send('Question not found');
  res.send(fssd);});

router.delete('/deleteAnswer/:answer_id', async function(req, res) {
  const hdd = await Answers .findById(req.params.answer_id).exec();
  const kge = await Questions .find({ answers: { $in: hdd } }).exec();
  kge.length > 0 && (kge[0].answers.pull(hdd._id), await kge[0].save());
  for (const fgurf of hdd.comments) {
    await Comments .deleteOne({ _id: fgurf._id }).exec();}
  await Answers .deleteOne({ _id: req.params.answer_id }).exec();
  res.send('success');});

router.put('/editAnswer/:answer_id', async function(req, res) {
  const hgef = await Answers .findById(req.params.answer_id).exec();
  if (!hgef) return res.status(404).send('Answer not found');
  const fujh = await Answers .updateOne({ _id: req.params.answer_id }, { $set: { text: req.body.text } }).exec();
  res.send(fujh);});

router.patch('/incrementVotes/:answer/:userVoted', async function(req, res) {
  const ijted = await Answers .findById(req.params.answer).exec();
  if (!ijted) return res.status(404).send('Answer not found');
  const uhfwe = ijted.voters.find(function(voter) {
    return voter.userVoted.toString() === req.params.userVoted; });
  const dfthgfe = uhfwe ? uhfwe.direction : -1;
  ijted.votes += dfthgfe === -1 ? 1 : dfthgfe === 0 ? 1 : 0;
  const hbersd = dfthgfe === -1 ? 10 : dfthgfe === 0 ? 5 : 0;
  const gfeygf = Math.min(dfthgfe + 1, 1);
  uhfwe ? (ijted.voters[ijted.voters.findIndex(function(obj) { return obj.userVoted == req.params.userVoted; })].direction = gfeygf) : ijted.voters.push({ userVoted: req.params.userVoted, direction: 1 });
  await ijted.save();
  const hgee = await Users .findOne({ _id: ijted.ans_by }).exec();
  hgee.reputation += hbersd;
  await hgee.save();
  res.status(200).send(ijted);});
  router.patch('/comments/incrementVotes/:comment/:userVoted', async (req, res) => {
    const comment = await Comments.findById(req.params.comment).exec();
    let updateUserReputation = 0;
    switch (!!comment) {
      case true:
        let voterObj = comment.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted);
        switch (voterObj.length === 0) {
          case true:
            comment.votes += 1;
            updateUserReputation = 5;
            comment.voters.push({
              userVoted: req.params.userVoted,});
            await comment.save();
            let userToUpdate = await Users.findOne({ _id: comment.com_by }).exec();
            userToUpdate.reputation += updateUserReputation;
            await userToUpdate.save();
            res.status(200).send(comment);
            break;
          default:
            res.status(200).send(comment); 
            break;  }
        break;
      default:
        res.status(404).send('Question not found');
        break; }});
  
  router.patch('/decrementVotes/:answer/:userVoted', async (req, res) => {
  const answer = await Answers.findById(req.params.answer).exec();
  if (!answer) return res.status(404).send('Answer not found');
  const voterObj = answer.voters.find((voter) => voter.userVoted.toString() === req.params.userVoted);
  const currentDirection = voterObj ? voterObj.direction : -1;
  answer.votes -= currentDirection === 1 ? 1 : currentDirection === 0 ? 1 : 0;
  const updateUserRep = currentDirection === 1 ? 5 : currentDirection === 0 ? 10 : 0;
  const direction = Math.max(currentDirection - 1, -1);
  voterObj ? (answer.voters[answer.voters.findIndex((obj) => obj.userVoted == req.params.userVoted)].direction = direction) : answer.voters.push({ userVoted: req.params.userVoted, direction: -1 });
  await answer.save();
  const userToUpdate = await Users.findOne({ _id: answer.ans_by }).exec();
  userToUpdate.reputation -= updateUserRep;
  await userToUpdate.save();
  res.status(200).send(answer);
});

module.exports = router;