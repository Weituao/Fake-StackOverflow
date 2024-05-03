const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Answers = require('../models/answers');
const Users = require('../models/users');
const Comments = require('../models/comments');

const auth = require('../middleware/auth');

router.get('/:qid', async (req, res) => {
  try {
    const foundQuestion = await Questions.findById(req.params.qid).exec();
    const foundAnswer = await Answers.find({ _id: { $in: foundQuestion.answers } }).sort({ ans_date_time: -1 });
    switch (true) {
      case foundAnswer && foundAnswer.length > 0:
        res.send(foundAnswer);
        break;
      default:
        res.status(404).send('Answer not found');
        break;
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/comments/:answer_id', async (req, res) => {
  try {
    const foundAnswer = await Answers.findById(req.params.answer_id).exec();
    const foundComment = await Comments.find({ _id: { $in: foundAnswer.comments } }).sort({ com_date_time: -1 });
    switch (true) {
      case foundComment && foundComment.length > 0:
        res.send(foundComment);
        break;
      default:
        res.status(404).send('Comment not found');
        break;
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/getQuestionsAnswered/:user_id', async (req, res) => {
  try {
    const answersByUser = await Answers.find({ ans_by: req.params.user_id }).exec();
    const foundQuestions = await Questions.find({ answers: { $in: answersByUser } }).sort({ ask_date_time: -1 });
    res.send(foundQuestions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.use(auth); // ANYTHING BELOW THIS WILL REQUIRE AUTHENTICATION

router.post('/answerQuestion', async (req, res) => {
  let newAnswerData = req.body;
  newAnswerData.ans_by = req.session.user.userId; // do not trust the client to send the user id via post request
  try {
    const newAnswer = new Answers({
      text: newAnswerData.text,
      ans_by: newAnswerData.ans_by,
    });
    await newAnswer.save();

    if (!newAnswerData.qid) {
      res.status(400).send('Missing qid parameter');
      return;
    }

    const foundQuestion = await Questions.findById(newAnswerData.qid).exec();

    if (foundQuestion) {
      foundQuestion.answers.push(newAnswer._id);
      await foundQuestion.save();
      res.send(foundQuestion);
    } else {
      res.status(404).send('Question not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/deleteAnswer/:answer_id', async (req, res) => {
  try {
    const foundAnswer = await Answers.findById(req.params.answer_id).exec();
    switch (true) {
      case foundAnswer:
        const foundQuestion = await Questions.find({ answers: { $in: foundAnswer } }).exec();
        if (foundQuestion) {
          foundQuestion[0].answers.pull(foundAnswer._id);
          await foundQuestion[0].save();
        }

        foundAnswer.comments.forEach(async (comment) => {
          await Comments.deleteOne({ _id: comment._id }).exec();
        });

        await Answers.deleteOne({ _id: req.params.answer_id }).exec();
        res.send('Success');
        break;
      default:
        res.status(404).send('Answer not found');
        break;
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/editAnswer/:answer_id', async (req, res) => {
  try {
    const foundAnswer = await Answers.findById(req.params.answer_id).exec();
    switch (true) {
      case foundAnswer:
        const result = await Answers.updateOne({ _id: req.params.answer_id }, { $set: { text: req.body.text } }).exec();
        res.send(result);
        break;
      default:
        res.status(404).send('Answer not found');
        break;
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.patch('/incrementVotes/:answer/:userVoted', async (req, res) => {
  const foundAnswer = await Answers.findById(req.params.answer).exec();
  let updateUserReputation = 0;
  switch (true) {
    case foundAnswer:
      let voterObj = foundAnswer.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted);
      if (voterObj.length > 0) {
        let userVoted = voterObj[0].userVoted;
        let currentDirection = voterObj[0].direction;
        if (currentDirection === -1) {
          foundAnswer.votes += 1;
          updateUserReputation = 10;
        } else if (currentDirection === 0) {
          foundAnswer.votes += 1;
          updateUserReputation = 5;
        }
        let direction = Math.min(currentDirection + 1, 1);
        const objIndex = foundAnswer.voters.findIndex((obj) => obj.userVoted == userVoted);
        foundAnswer.voters[objIndex].direction = direction;
      } else {
        foundAnswer.votes += 1;
        updateUserReputation = 5;
        foundAnswer.voters.push({
          userVoted: req.params.userVoted,
          direction: 1,
        });
      }
      await foundAnswer.save();
      let userToUpdate = await Users.findOne({ _id: foundAnswer.ans_by }).exec();
      userToUpdate.reputation += updateUserReputation;
      await userToUpdate.save();
      res.status(200).send(foundAnswer);
      break;
    default:
      res.status(404).send('Answer not found');
      break;
  }
});

router.patch('/comments/incrementVotes/:comment/:userVoted', async (req, res) => {
  const foundComment = await Comments.findById(req.params.comment).exec();
  let updateUserReputation = 0;
  switch (true) {
    case foundComment:
      let voterObj = foundComment.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted);
      if (voterObj.length === 0) {
        foundComment.votes += 1;
        updateUserReputation = 5;
        foundComment.voters.push({
          userVoted: req.params.userVoted,
        });
      }
      await foundComment.save();
      let userToUpdate = await Users.findOne({ _id: foundComment.com_by }).exec();
      userToUpdate.reputation += updateUserReputation;
      await userToUpdate.save();
      res.status(200).send(foundComment);
      break;
    default:
      res.status(404).send('Comment not found');
      break;
  }
});

router.patch('/decrementVotes/:answer/:userVoted', async (req, res) => {
  const foundAnswer = await Answers.findById(req.params.answer).exec();
  let updateUserReputation = 0;
  switch (true) {
    case foundAnswer:
      let voterObj = foundAnswer.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted);
      if (voterObj.length > 0) {
        let userVoted = voterObj[0].userVoted;
        let currentDirection = voterObj[0].direction;
        if (currentDirection === 1) {
          foundAnswer.votes -= 1;
          updateUserReputation = 5;
        } else if (currentDirection === 0) {
          foundAnswer.votes -= 1;
          updateUserReputation = 10;
        }
        let direction = Math.max(currentDirection - 1, -1);
        const objIndex = foundAnswer.voters.findIndex((obj) => obj.userVoted == userVoted);
        foundAnswer.voters[objIndex].direction = direction;
      } else {
        foundAnswer.votes -= 1;
        updateUserReputation = 10;
        foundAnswer.voters.push({
          userVoted: req.params.userVoted,
          direction: -1,
        });
      }
      await foundAnswer.save();
      let userToUpdate = await Users.findOne({ _id: foundAnswer.ans_by }).exec();
      userToUpdate.reputation -= updateUserReputation;
      await userToUpdate.save();
      res.status(200).send(foundAnswer);
      break;
    default:
      res.status(404).send('Answer not found');
      break;
  }
});

module.exports = router;
