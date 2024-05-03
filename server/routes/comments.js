// Routing to /posts/comments
const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Answers = require('../models/answers');
const Users = require('../models/users');
const Comments = require('../models/comments');

const auth = require('../middleware/auth');

router.use(auth); // ANYTHING BELOW THIS WILL REQUIRE AUTHENTICATION

router.post('/addComment', async (req, res) => {
  const h5t4fdgdf = req.body.commentType;
  const dfghydf = req.body.toId;
  let fgdtrhtsdqwfd = req.body;
  fgdtrhtsdqwfd.com_by = req.session.user.userId;

  const user = await Users.findById(fgdtrhtsdqwfd.com_by).exec();

  return user.reputation < 50 ?
    res.send('User reputation too low') :
    fgdtrhtsdqwfd.text.length === 0 || fgdtrhtsdqwfd.text.length > 140 ?
    res.send('Comment must be between 1 and 140 characters') :
    (async () => {
      try {
        const dfghjhjmdfswe = new Comments({
          text: fgdtrhtsdqwfd.text,
          com_by: fgdtrhtsdqwfd.com_by,
        });
        await dfghjhjmdfswe.save();

        switch (h5t4fdgdf) {
          case 'question':
            const sdfsdethgfd = await Questions.findById(dfghydf).exec();
            await addCommentToQuestion(dfghjhjmdfswe, sdfsdethgfd);
            break;
          case 'answer':
            const sdweethtyhdfgd = await Answers.findById(dfghydf).exec();
            await addCommentToAnswer(dfghjhjmdfswe, sdweethtyhdfgd);
            break;
        }

        res.send('success');
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    })();
});

async function addCommentToQuestion(comment, question) {
  question.comments.push(comment._id);
  return question.save();
}

async function addCommentToAnswer(comment, answer) {
  answer.comments.push(comment._id);
  return answer.save();
}


module.exports = router;
