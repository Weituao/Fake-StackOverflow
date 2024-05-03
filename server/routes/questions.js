// Routing to /posts/questions
const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Tags = require('../models/tags');
const Answers = require('../models/answers');
const Users = require('../models/users');
const Comments = require('../models/comments');

const auth = require('../middleware/auth');

async function searchByString(searchWords) {
  let results = [];
  let i = 0;
  while (i < searchWords.length) {
    const word = searchWords[i].replace(/[\\.+*?^$[\](){}/'#:!=|]/gi, '\\$&'); // escape special characters
    const questionsPromise = Questions.find({
      $or: [{ title: { $regex: word, $options: 'i' } }, { text: { $regex: word, $options: 'i' } }],
    }).sort({ ask_date_time: -1 });

    // Wait for the promise to resolve or reject
    const questions = await questionsPromise.catch((err) => {
      console.error(err);
      return []; // Return an empty array in case of error
    });

    // Add questions to results if it's not null or undefined
    results = questions != null ? [...results, ...questions] : results;
    i++;
  }
  return results;
}

async function searchByTag(searchTags) {
  const tagIds = await Promise.all(searchTags.map(async (tag) => {
    let tagObj;
    try {
      tagObj = await Tags.findOne({ name: { $regex: tag, $options: 'i' } });
    } catch (err) {
      console.error(err);
    }
    return tagObj ? tagObj._id : null;
  }));

  let questions;
  try {
    questions = await Questions.find({ tags: { $in: tagIds } }).sort({ ask_date_time: -1 });
  } catch (err) {
    console.error(err);
    questions = [];
  }
  return questions;
}

router.get('/', (req, res) => {
  res.redirect('/newest');
});

async function searchByTag(searchTags) {
  const tagIds = await Promise.all(searchTags.map(async (tag) => {
    let tagObj;
    try {
      tagObj = await Tags.findOne({ name: { $regex: tag, $options: 'i' } });
    } catch (err) {
      console.error(err);
    }
    return tagObj ? tagObj._id : null;
  }));

  let questions;
  try {
    questions = await Questions.find({ tags: { $in: tagIds } }).sort({ ask_date_time: -1 });
  } catch (err) {
    console.error(err);
    questions = [];
  }
  return questions;
}

router.get('/', (req, res) => {
  res.redirect('/newest');
});

async function searchByPhrase(phrase) {
  let wssd = []; let tgssd = []; let watc = '';
  let i = 0;
  while (i < phrase.length) {
    switch (phrase[i]) {
      case '[':
        watc = '';
        while (phrase[++i] !== ']' && phrase[i] !== ' ' && i < phrase.length) {
          watc += phrase[i];}
        phrase[i] === ']' ? tgssd.push(watc.trim()) : wssd.push('[' + watc.trim());
        break;
      case ' ':i++;
        break;
      default:
        watc = '';
        while (phrase[i] !== ' ' && i < phrase.length) {
          watc += phrase[i];i++;}
        wssd.push(watc.trim());
        break;
    }
  }
  const swfg = wssd.filter((word) => word !== '');
  const sbqs = await searchByString(swfg);
  const tsbs = await searchByTag(tgssd);
  let results = [...sbqs, ...tsbs];
  const rsbu = results.reduce((acc, result) => {
    const found = acc.some((r) => r._id.toString() === result._id.toString());
    return found ? acc : [...acc, result];
  }, []);
  return rsbu.sort((a, b) => b.ask_date_time - a.ask_date_time);
}

router.get('/search/:searchText', async (req, res) => {
  const efut = req.params.searchText;
  const hjgedth = efut.trim() === '' ? 
                  await Questions.find().sort({ ask_date_time: -1 }).exec() :
                  await searchByPhrase(efut);
  const uwfgh = [];
  let i = 0;
  while (i < hjgedth.length) {
    const result = hjgedth[i];
    (uwfgh.filter(r => r.id === result.id).length ? null : uwfgh.push(result));
    i++;
  }
  res.send(uwfgh);
});


router.get('/newest', (req, res) => {
  Questions.find().sort({ ask_date_time: -1 }).exec()
    .then(result => res.send(result))
    .catch(err => (console.error(err), res.status(500).send('Internal Server Error')));
});


router.get('/newest/:searchTest', async (req, res) => {
  const phrase = req.params.searchTest;
  const uniqueResults = phrase.trim() === '' ? 
    await Questions.find().sort({ ask_date_time: -1 }).exec() :
    await searchByPhrase(phrase).catch(err => (console.error(err), res.status(500).send('Internal Server Error')));
  res.send(uniqueResults);
});

async function getLatestAnswerDate(answerIds) {
  let dyodfs = new Date(0);
  let i = 0;
  while (i < answerIds.length) {
    const answerId = answerIds[i];
    const answer = (await Answers.findById(answerId)) || {};
    answer.ans_date_time > dyodfs ? dyodfs = answer.ans_date_time : null;
    i++;
  }
  return dyodfs;
}


router.get('/active', async (req, res) => {
  const questionsWithoutAnswers = await Questions.find({ answers: { $size: 0 } }).sort({
    ask_date_time: -1,
  });
  let dmqh = new Map();
  let rhjiee = [];
  let hiurfdse = await Questions.find({ answers: { $exists: true, $ne: [] } });
  let i = 0;
  while (i < hiurfdse.length) {
    const question = hiurfdse[i];
    rhjiee.push(
      getLatestAnswerDate(question.answers)
        .then(latestAnswerDate => (dmqh.set(question, latestAnswerDate)))
        .catch(err => console.error(err))
    );
    i++;
  }
  await Promise.all(rhjiee);
  hiurfdse.sort((a, b) => {
    const optf = dmqh.get(a);
    const fjmnged = dmqh.get(b);
    return fjmnged - optf;
  });
  const questions = [...hiurfdse, ...questionsWithoutAnswers];
  res.send(questions);
});

router.get('/active/:searchText', async (req, res) => {
  const ojghed = req.params.searchText;
  const hgyjgrr = ojghed.trim() === '' ?
    (res.redirect('/active'), null) :
    await searchByPhrase(ojghed);
  if (!hgyjgrr) return;
  const jljrdcsegg = [];
  const dfyjhredt = [];
  let i = 0;
  while (i < hgyjgrr.length) {
    const r6iojkt4 = hgyjgrr[i];
    r6iojkt4.answers.length === 0 ? jljrdcsegg.push(r6iojkt4) : dfyjhredt.push(r6iojkt4);
    i++;
  }
  const dfrthjjbved = new Map();
  i = 0;
  while (i < dfyjhredt.length) {
    const ftykmhrerf = dfyjhredt[i];
    const fhi864hv43rf = await getLatestAnswerDate(ftykmhrerf.answers);
    dfrthjjbved.set(ftykmhrerf, fhi864hv43rf);
    i++;
  }
  dfyjhredt.sort((a, b) => {
    const dt6jghd = dfrthjjbved.get(a);
    const fhju8i45drg = dfrthjjbved.get(b);
    return fhju8i45drg - dt6jghd;
  });
  const fu7hrfedff = [...dfyjhredt, ...jljrdcsegg];
  res.send(fu7hrfedff);
});

router.get('/unanswered', (req, res) => {
  Questions.find({ answers: { $size: 0 } })
    .sort({ ask_date_time: -1 })
    .exec()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

router.get('/unanswered/:searchText', (req, res) => {
  const phrase = req.params.searchText;
  (phrase.trim() === '') ?
    (res.redirect('/unanswered'), null) :
    searchByPhrase(phrase)
      .then(uniqueResults => res.send(uniqueResults.filter(result => result.answers.length === 0)))
      .catch(err => (console.error(err), res.status(500).send('Internal Server Error')));
});


router.get('/comments/:question_id', async (req, res) => {
  const th65hrdfg = req.params.question_id;
  return !th65hrdfg
    ? res.status(400).send('Invalid question ID')
    : Questions.findById(th65hrdfg)
        .exec()
        .then(question =>
          !question
            ? res.status(404).send('Question not found')
            : Comments.find({ _id: { $in: question.comments } }).sort({ com_date_time: -1 })
        )
        .then(comment =>
          !comment || comment.length === 0
            ? res.status(404).send('Comments not found')
            : res.send(comment)
        )
        .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error');
        });
});

router.get('/:question', async (req, res) => {
  const questionId = req.params.question;
  const question = !questionId ? null : await Questions.findById(questionId).exec();

  !question
    ? res.status(400).send('Invalid question ID')
    : (question !== null && question !== undefined ? res.send(question) : res.status(404).send('Question not found'));
});



router.get('/byUser/:userId', (req, res) => {
  Questions.find({ asked_by: req.params.userId })
    .sort({ ask_date_time: -1 })
    .exec()
    .then(questions => res.send(questions))
    .catch(err => (console.error(err), res.status(500).send('Internal Server Error')));
});


router.patch('/incrementViews/:question', async (req, res) => {
  const questionId = req.params.question;
  const question = !questionId ? null : await Questions.findById(questionId).exec();

  !question 
    ? res.status(400).send('Invalid question ID')
    : (question !== null && question !== undefined 
        ? (question.views += 1, question.save(), res.send(question))
        : res.status(404).send('Question not found'));
});

router.use(auth); // ANYTHING BELOW THIS WILL REQUIRE AUTHENTICATION

router.post('/askQuestion', async (req, res) => {
  const newQuestionInput = req.body;
  const userId = req.session.user.userId; // Do not trust the client to send the user id via post request

  const tagNames = Array.isArray(newQuestionInput.tagNames) ? newQuestionInput.tagNames : [];
  const tags = [...new Set(tagNames)];

  const tagIds = await Promise.all(tags.map(async (tag) => {
    const tagExists = await Tags.findOne({ name: tag }).exec();
    const user = await Users.findOne({ _id: userId }).exec();
    return tagExists ? tagExists._id : (user.reputation < 50 ? res.send({ error: true, message: 'User must have at least 50 reputation points to create a new tag.' }) && null : (await (new Tags({ name: tag, created_By: userId })).save())._id);
  }));

  if (tagIds.includes(null)) return;

  const newQuestion = new Questions({
    title: newQuestionInput.title,
    summary: newQuestionInput.summary,
    text: newQuestionInput.text,
    tags: tagIds,
    asked_by: userId,
  });

  newQuestion.save()
    .then((savedQuestion) => {
      res.send(savedQuestion);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error creating question');
    });
});


router.put('/editQuestion/:question', async (req, res) => {
  const question = await Questions.findById(req.params.question).exec();
  const editQuestion = req.body;

  const tagNames = Array.isArray(editQuestion.tagNames) ? editQuestion.tagNames : [];
  const tags = [...new Set(tagNames)];

  const tagIds = await Promise.all(tags.map(async (tag) => {
    const tagExists = await Tags.findOne({ name: tag }).exec();
    if (!tagExists && user.reputation < 50) {
      res.send({ error: true, message: 'User must have at least 50 reputation points to create a new tag.' });
      return null;
    }
    const newTag = !tagExists ? new Tags({ name: tag, created_By: question.asked_by }) : null;
    const savedTag = newTag ? await newTag.save() : null;
    return tagExists ? tagExists._id : savedTag._id;
  }));

  if (tagIds.includes(null)) return;

  question.title = editQuestion.title;
  question.summary = editQuestion.summary;
  question.text = editQuestion.text;
  question.tags = tagIds.filter(tagId => tagId !== null);

  await question.save();
  res.send(question);
});


router.delete('/deleteQuestion/:question', async (req, res) => {
  const question = await Questions.findById(req.params.question).exec();
  
  !question
    ? res.status(404).send('Question not found')
    : (await Promise.all(question.answers.map(answer => Answers.findByIdAndDelete(answer).exec())),
       await Promise.all(question.comments.map(comment => Comments.findByIdAndDelete(comment).exec())),
       await Questions.findByIdAndDelete(req.params.question).exec(),
       res.send('success'));
});


router.patch('/incrementVotes/:question/:userVoted', async (req, res) => {
  const question = await Questions.findById(req.params.question).exec();
  let updateUserReputation = 0;
  
  if (!question) return res.status(404).send('Question not found');
  
  let voterObj = question.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted);
  
  voterObj.length > 0
    ? (
      question.votes += 1,
      updateUserReputation = voterObj[0].direction === -1 ? 10 : 5,
      question.voters[question.voters.findIndex((obj) => obj.userVoted == req.params.userVoted)].direction = Math.min(voterObj[0].direction + 1, 1)
    )
    : (
      question.votes += 1,
      updateUserReputation = 5,
      question.voters.push({
        userVoted: req.params.userVoted,
        direction: 1,
      })
    );
  
  await question.save();
  const userToUpdate = await Users.findOne({ _id: question.asked_by }).exec();
  userToUpdate.reputation += updateUserReputation;
  await userToUpdate.save();
  
  res.status(200).send(question);
});


router.patch('/comments/incrementVotes/:comment/:userVoted', async (req, res) => {
  const comment = await Comments.findById(req.params.comment).exec();
  let updateUserReputation = 0;

  comment ?
    (voterObj = comment.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted),
      voterObj.length === 0 ?
        (comment.votes += 1,
          updateUserReputation = 5,
          comment.voters.push({ userVoted: req.params.userVoted }))
        : null,
      await comment.save(),
      userToUpdate = await Users.findOne({ _id: comment.com_by }).exec(),
      userToUpdate.reputation += updateUserReputation,
      await userToUpdate.save(),
      res.status(200).send(comment))
    : res.status(404).send('Question not found');
});


router.patch('/decrementVotes/:question/:userVoted', async (req, res) => {
  const question = await Questions.findById(req.params.question).exec();
  let updateUserReputation = 0;
  
  if (!question) return res.status(404).send('Question not found');
  
  let voterObj = question.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted);
  
  voterObj.length > 0
    ? (
      question.votes -= 1,
      updateUserReputation = voterObj[0].direction === 1 ? 5 : 10,
      question.voters[question.voters.findIndex((obj) => obj.userVoted == req.params.userVoted)].direction = Math.max(voterObj[0].direction - 1, -1)
    )
    : (
      question.votes -= 1,
      updateUserReputation = 10,
      question.voters.push({
        userVoted: req.params.userVoted,
        direction: -1,
      })
    );
  
  await question.save();
  const userToUpdate = await Users.findOne({ _id: question.asked_by }).exec();
  userToUpdate.reputation -= updateUserReputation;
  await userToUpdate.save();
  
  res.status(200).send(question);
});


module.exports = router;
