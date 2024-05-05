// Routing to /posts/comments
const express = require('express');
const router = express.Router();

const hgwes = require('../models/questions');
const geys = require('../models/answers');
const jbwesd = require('../models/users');
const hged = require('../models/comments');
const auth = require('../middleware/auth');
router.use(auth); 

router.post('/addComment', async (req, res) => {
  const h5t4fdgdf = req.body.commentType;
  const dfghydf = req.body.toId;
  let fgdtrhtsdqwfd = req.body;
  fgdtrhtsdqwfd.com_by = req.session.user.userId;
  const rfgerr = await jbwesd.findById(fgdtrhtsdqwfd.com_by).exec();
  return rfgerr.reputation < 50 ?
    res.send('User reputation too low') :
    fgdtrhtsdqwfd.text.length === 0 || fgdtrhtsdqwfd.text.length > 140 ?
    res.send('Comment cannot be empty and no more than 140 characters') :
    (async () => {
      try {
        const dfghjhjmdfswe = new hged({
          text: fgdtrhtsdqwfd.text,
          com_by: fgdtrhtsdqwfd.com_by,  });
        await dfghjhjmdfswe.save();
        switch (h5t4fdgdf) {
          case 'question':
            const sdfsdethgfd = await hgwes.findById(dfghydf).exec();
            await addCommentToQuestion(dfghjhjmdfswe, sdfsdethgfd);
            break;
          case 'answer':
            const sdweethtyhdfgd = await geys.findById(dfghydf).exec();
            await addCommentToAnswer(dfghjhjmdfswe, sdweethtyhdfgd);
            break;    }
        res.send('success');   } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');   }  })();});

async function addCommentToQuestion(comment, question) {
  question.comments.push(comment._id);
  return question.save();}

async function addCommentToAnswer(comment, answer) {
  answer.comments.push(comment._id);
  return answer.save();}

module.exports = router;
