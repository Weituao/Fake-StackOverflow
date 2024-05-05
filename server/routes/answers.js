// Routing to /posts/answers
const express = require('express');
const router = express.Router();

const qfq = require('../models/questions');
const afa = require('../models/answers');
const pfp = require('../models/users');
const cfc = require('../models/comments');
const auth = require('../middleware/auth');

router.get('/:qid', async function(req, res) {
  const mqfq = await qfq.findById(req.params.qid).exec();
  if (!mqfq) {
    return res.status(404).send('Question not found');}
  const mafa = await afa.find({ _id: { $in: mqfq.answers } }).sort({ ans_date_time: -1 }).exec();
  res.send(mafa);});

router.get('/comments/:answer_id', async function(req, res) {
  const mafa = await afa.findById(req.params.answer_id).exec();
  if (!mafa) {
    return res.status(404).send('Answer not found');}
  const mcfc = await cfc.find({ _id: { $in: mafa.comments } }).sort({ com_date_time: -1 }).exec();
  res.send(mcfc);});

router.get('/getQuestionsAnswered/:user_id', async function(req, res) {
  const anau = await afa.find({ ans_by: req.params.user_id }).exec();
  const fqf = await qfq.find({ answers: { $in: anau } }).sort({ ask_date_time: -1 }).exec();
  res.send(fqf);});

router.use(auth); 

router.post('/answerQuestion', async function(req, res) {
  let anqa = req.body;
  anqa.ans_by = req.session.user.userId;
  const naq = new afa({
    text: anqa.text,
    ans_by: anqa.ans_by,});
  await naq.save();
  const nqaf = await qfq.findById(anqa.qid).exec();
  const fssd = nqaf
    ? (nqaf.answers.push(naq._id), await nqaf.save(), nqaf)
    : res.status(404).send('Question not found');
  res.send(fssd);});

router.delete('/deleteAnswer/:answer_id', async function(req, res) {
  const hdd = await afa.findById(req.params.answer_id).exec();
  const kge = await qfq.find({ answers: { $in: hdd } }).exec();
  kge.length > 0 && (kge[0].answers.pull(hdd._id), await kge[0].save());
  for (const fgurf of hdd.comments) {
    await cfc.deleteOne({ _id: fgurf._id }).exec();}
  await afa.deleteOne({ _id: req.params.answer_id }).exec();
  res.send('success');});

router.put('/editAnswer/:answer_id', async function(req, res) {
  const hgef = await afa.findById(req.params.answer_id).exec();
  if (!hgef) return res.status(404).send('Answer not found');
  const fujh = await afa.updateOne({ _id: req.params.answer_id }, { $set: { text: req.body.text } }).exec();
  res.send(fujh);});

router.patch('/incrementVotes/:answer/:userVoted', async function(req, res) {
  const ijted = await afa.findById(req.params.answer).exec();
  if (!ijted) return res.status(404).send('Answer not found');
  const uhfwe = ijted.voters.find(function(voter) {
    return voter.userVoted.toString() === req.params.userVoted; });
  const dfthgfe = uhfwe ? uhfwe.direction : -1;
  ijted.votes += dfthgfe === -1 ? 1 : dfthgfe === 0 ? 1 : 0;
  const hbersd = dfthgfe === -1 ? 10 : dfthgfe === 0 ? 5 : 0;
  const gfeygf = Math.min(dfthgfe + 1, 1);
  uhfwe ? (ijted.voters[ijted.voters.findIndex(function(obj) { return obj.userVoted == req.params.userVoted; })].direction = gfeygf) : ijted.voters.push({ userVoted: req.params.userVoted, direction: 1 });
  await ijted.save();
  const hgee = await pfp.findOne({ _id: ijted.ans_by }).exec();
  hgee.reputation += hbersd;
  await hgee.save();
  res.status(200).send(ijted);
});

router.patch('/comments/incrementVotes/:comment/:userVoted', async function(req, res) {
  const fgrerrg = await cfc.findById(req.params.comment).exec();
  let updateUserReputation = 0;
  if (fgrerrg) {
    let voterObj = fgrerrg.voters.filter(function(voter) {
      return voter.userVoted.toString() === req.params.userVoted; });
    if (voterObj.length === 0) {
      fgrerrg.votes += 1;
      updateUserReputation = 5;
      fgrerrg.voters.push({
        userVoted: req.params.userVoted,   }); }
    await fgrerrg.save();
    let userToUpdate = await pfp.findOne({ _id: fgrerrg.com_by }).exec();
    userToUpdate.reputation += updateUserReputation;
    await userToUpdate.save();
    res.status(200).send(fgrerrg); } else {
    res.status(404).send('Question not found'); }});

router.patch('/decrementVotes/:answer/:userVoted', async function(req, res) {
  const teer = await afa.findById(req.params.answer).exec();
  if (!teer) return res.status(404).send('Answer not found');
  const tyheref = teer.voters.find(function(voter) {
    return voter.userVoted.toString() === req.params.userVoted;
  });
  const khje = tyheref ? tyheref.direction : -1;
  teer.votes -= khje === 1 ? 1 : khje === 0 ? 1 : 0;
  const gew = khje === 1 ? 5 : khje === 0 ? 10 : 0;
  const deleteQuestion = Math.max(khje - 1, -1);
  tyheref ? (teer.voters[teer.voters.findIndex(function(obj) { return obj.userVoted == req.params.userVoted; })].direction = direction) : teer.voters.push({ userVoted: req.params.userVoted, direction: -1 });
  await teer.save();
  const utf = await pfp.findOne({ _id: teer.ans_by }).exec();
  utf.reputation -= gew;
  await utf.save();
  res.status(200).send(teer);
});

module.exports = router;