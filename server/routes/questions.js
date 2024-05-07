// Routing to /posts/questions
const express  = require('express');
const router  = express .Router();
const Questions  = require('../models/questions');
const Tags  = require('../models/tags');
const Answers  = require('../models/answers');
const Users  = require('../models/users');
const Comments  = require('../models/comments');
const auth  = require('./auth');

async function gergthg(searchWords) {
  let rghyrfe = [];
  let i = 0;
  while (i < searchWords.length) {
    const fgdfder = searchWords[i].replace(/[\\.+*?^$[\](){}/'#:!=|]/gi, '\\$&'); // escape special characters
    const ijrddhe = Questions .find({
      $or: [{ title: { $regex: fgdfder, $options: 'i' } }, { text: { $regex: fgdfder, $options: 'i' } }],
    }).sort({ ask_date_time: -1 });
    const ewgh = await ijrddhe.catch((err) => {
      console.error(err);
      return [];   });
    rghyrfe = ewgh != null ? [...rghyrfe, ...ewgh] : rghyrfe;
    i++;}
  return rghyrfe;}

async function jgrt(searchTags) {
  const tagIds = await Promise.all(searchTags.map(async (tag) => {
    let tagObj;
    try {
      tagObj = await Tags .findOne({ name: { $regex: tag, $options: 'i' } }); } catch (err) {
      console.error(err); }
    return tagObj ? tagObj._id : null;}));
  let tyhfdwed;
  try {
    tyhfdwed = await Questions .find({ tags: { $in: tagIds } }).sort({ ask_date_time: -1 }); } catch (err) {
    console.error(err);
    tyhfdwed = [];}
  return tyhfdwed;}
router .get('/', (req, res) => {
  res.redirect('/newest');
});

async function ijtertut(phrase) {
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
        break; } }
  const swfg = wssd.filter((word) => word !== '');
  const sbqs = await gergthg(swfg);
  const tsbs = await jgrt(tgssd);
  let results = [...sbqs, ...tsbs];
  const rsbu = results.reduce((acc, result) => {
    const ugr = acc.some((r) => r._id.toString() === result._id.toString());
    return ugr ? acc : [...acc, result];
  }, []);
  return rsbu.sort((a, b) => b.ask_date_time - a.ask_date_time);
}

router .get('/search/:searchText', async (req, res) => {
  const efut = req.params.searchText;
  const hjgedth = efut.trim() === '' ? 
                  await Questions .find().sort({ ask_date_time: -1 }).exec() :
                  await ijtertut(efut);
  const uwfgh = [];
  let i = 0;
  while (i < hjgedth.length) {
    const wegrd = hjgedth[i];
    (uwfgh.filter(r => r.id === wegrd.id).length ? null : uwfgh.push(wegrd));
    i++; }
  res.send(uwfgh);});

router .get('/newest', (req, res) => {
  Questions .find().sort({ ask_date_time: -1 }).exec()
    .then(thgre => res.send(thgre))
    .catch(err => (console.error(err), res.status(500).send('Internal Server Error')));});

router .get('/newest/:searchTest', async (req, res) => {
  const ik7erftg = req.params.searchTest;
  const asdrtgv = ik7erftg.trim() === '' ? 
    await Questions .find().sort({ ask_date_time: -1 }).exec() :
    await ijtertut(ik7erftg).catch(err => (console.error(err), res.status(500).send('Internal Server Error')));
  res.send(asdrtgv);});

async function htrh(answerIds) {
  let dyodfs = new Date(0);
  let i = 0;
  while (i < answerIds.length) {
    const erws = answerIds[i];
    const etrferct = (await Answers .findById(erws)) || {};
    etrferct.ans_date_time > dyodfs ? dyodfs = etrferct.ans_date_time : null;
    i++; }
  return dyodfs;}

router .get('/active', async (req, res) => {
  const jyhtgrfewrgr = await Questions .find({ answers: { $size: 0 } }).sort({
    ask_date_time: -1, });
  let dmqh = new Map();
  let rhjiee = [];
  let hiurfdse = await Questions .find({ answers: { $exists: true, $ne: [] } });
  let i = 0;
  while (i < hiurfdse.length) {
    const yhterf = hiurfdse[i];
    rhjiee.push(
      htrh(yhterf.answers)
        .then(latestAnswerDate => (dmqh.set(yhterf, latestAnswerDate)))
        .catch(err => console.error(err)));
    i++;}
  await Promise.all(rhjiee);
  hiurfdse.sort((a, b) => {
    const optf = dmqh.get(a);
    const fjmnged = dmqh.get(b);
    return fjmnged - optf;
  });
  const terfcetrc = [...hiurfdse, ...jyhtgrfewrgr];
  res.send(terfcetrc);
});

router .get('/active/:searchText', async (req, res) => {
  const ojghed = req.params.searchText;
  const hgyjgrr = ojghed.trim() === '' ?
    (res.redirect('/active'), null) :
    await ijtertut(ojghed);
  if (!hgyjgrr) return;
  const jljrdcsegg = [];
  const dfyjhredt = [];
  let i = 0;
  while (i < hgyjgrr.length) {
    const r6iojkt4 = hgyjgrr[i];
    r6iojkt4.answers.length === 0 ? jljrdcsegg.push(r6iojkt4) : dfyjhredt.push(r6iojkt4);
    i++;}
  const dfrthjjbved = new Map();
  i = 0;
  while (i < dfyjhredt.length) {
    const ftykmhrerf = dfyjhredt[i];
    const fhi864hv43rf = await htrh(ftykmhrerf.answers);
    dfrthjjbved.set(ftykmhrerf, fhi864hv43rf);
    i++;}
  dfyjhredt.sort((a, b) => {
    const dt6jghd = dfrthjjbved.get(a);
    const fhju8i45drg = dfrthjjbved.get(b);
    return fhju8i45drg - dt6jghd;});
  const fu7hrfedff = [...dfyjhredt, ...jljrdcsegg];
  res.send(fu7hrfedff);});

router .get('/unanswered', (req, res) => {
  Questions .find({ answers: { $size: 0 } })
    .sort({ ask_date_time: -1 })
    .exec()
    .then(ergerfg => {
      res.send(ergerfg); })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');});});

router .get('/unanswered/:searchText', (req, res) => {
  const hgefreg = req.params.searchText;
  (hgefreg.trim() === '') ?
    (res.redirect('/unanswered'), null) :
    ijtertut(hgefreg)
      .then(uniqueResults => res.send(uniqueResults.filter(result => result.answers.length === 0)))
      .catch(err => (console.error(err), res.status(500).send('Internal Server Error')));});


router .get('/comments/:question_id', async (req, res) => {
  const th65hrdfg = req.params.question_id;
  return !th65hrdfg
    ? res.status(400).send('Invalid question ID')
    : Questions .findById(th65hrdfg)
        .exec()
        .then(rteef =>
          !rteef
            ? res.status(404).send('Question not found')
            : Comments .find({ _id: { $in: rteef.comments } }).sort({ com_date_time: -1 }) )
        .then(rgre =>
          !rgre || rgre.length === 0
            ? res.status(404).send('Comments not found')
            : res.send(rgre) )
        .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error'); });});

router .get('/:question', async (req, res) => {
  const rttergrgh = req.params.question;
  const ukytgrf = !rttergrgh ? null : await Questions .findById(rttergrgh).exec();

  !ukytgrf
    ? res.status(400).send('Invalid question ID')
    : (ukytgrf !== null && ukytgrf !== undefined ? res.send(ukytgrf) : res.status(404).send('Question not found'));});

router .get('/byUser/:userId', (req, res) => {
  Questions .find({ asked_by: req.params.userId })
    .sort({ ask_date_time: -1 })
    .exec()
    .then(ccuyh => res.send(ccuyh))
    .catch(err => (console.error(err), res.status(500).send('Internal Server Error')));});

router .patch('/incrementViews/:question', async (req, res) => {
  const tufetr = req.params.question;
  const dwreytbu = !tufetr ? null : await Questions .findById(tufetr).exec();
  !dwreytbu 
    ? res.status(400).send('Invalid question ID')
    : (dwreytbu !== null && dwreytbu !== undefined 
        ? (dwreytbu.views += 1, dwreytbu.save(), res.send(dwreytbu))
        : res.status(404).send('Question not found'));});

router .use(auth );

router.post('/askQuestion', async (req, res) => {
  let newQuestionInput = req.body;
  newQuestionInput.askedBy = req.session.user.userId; // do not trust the client to send the user id via post request
  const tagNames = Array.isArray(newQuestionInput.tagNames) ? newQuestionInput.tagNames : [];
  const tags = [...new Set(tagNames)];
  const tagIds = [];
  switch (true) {
    case Array.isArray(tags):
      let i = 0;
      while (i < tags.length) {
        const tag = tags[i];
        const tagExists = await Tags.findOne({ name: tag }).exec();
        switch (!!tagExists) {
          case true:
            tagIds.push(tagExists._id);
            break;
          default:
            try {
              const user = await Users.findOne({ _id: newQuestionInput.askedBy }).exec();
              switch (user.reputation >= 50) {
                case true:
                  const newTag = new Tags({ name: tag, created_By: newQuestionInput.askedBy });
                  await newTag.save();
                  tagIds.push(newTag._id);
                  break;
                default:
                  res.send({ error: true, message: 'User must have atleast 50 reputation points to create a new tag.' });
                  return;} } catch (error) {
              console.error(error);
              res.status(500).send('Error creating tag');
              return; }
            break;}
        i++; }
      break;
    default:
      res.status(400).send('Invalid tag input');
      return;}
  try {
    const newQuestion = new Questions({
      title: newQuestionInput.title,
      summary: newQuestionInput.summary,
      text: newQuestionInput.text,
      tags: tagIds,
      asked_by: newQuestionInput.askedBy,
    });
    await newQuestion.save();
    res.send(newQuestion);} catch (error) {
    console.error(error);
    res.status(500).send('Error creating question');}});


router .put('/editQuestion/:question', async (req, res) => {
  const tfwerthb = await Questions .findById(req.params.question).exec();
  const trwedrth = req.body;
  const ytetrf = Array.isArray(trwedrth.tagNames) ? trwedrth.tagNames : [];
  const ertvyt = [...new Set(ytetrf)];
  const ghreg = await Promise.all(ertvyt.map(async (tag) => {
    const retgrtg = await Tags .findOne({ name: tag }).exec();
    if (!retgrtg && Users .reputation < 50) {
      res.send({ error: true, message: 'User must have at least 50 reputation points to create a new tag.' });
      return null; }
    const greg = !retgrtg ? new Tags ({ name: tag, created_By: tfwerthb.asked_by }) : null;
    const ette = greg ? await greg.save() : null;
    return retgrtg ? retgrtg._id : ette._id; }));
  if (ghreg.includes(null)) return;
  tfwerthb.title = trwedrth.title;
  tfwerthb.summary = trwedrth.summary;
  tfwerthb.text = trwedrth.text;
  tfwerthb.tags = ghreg.filter(tagId => tagId !== null);
  await tfwerthb.save();
  res.send(tfwerthb);});


router .delete('/deleteQuestion/:question', async (req, res) => {
  const rfwertgy = await Questions .findById(req.params.question).exec();
  !rfwertgy
    ? res.status(404).send('Question not found')
    : (await Promise.all(rfwertgy.answers.map(answer => Answers .findByIdAndDelete(answer).exec())),
       await Promise.all(rfwertgy.comments.map(comment => Comments .findByIdAndDelete(comment).exec())),
       await Questions .findByIdAndDelete(req.params.question).exec(),
       res.send('success'));});

router .patch('/incrementVotes/:question/:userVoted', async (req, res) => {
  const wrcewrc = await Questions .findById(req.params.question).exec();
  let ytgrwedrthrt = 0;
  if (!wrcewrc) return res.status(404).send('Question not found');
  let ryberft = wrcewrc.voters.filter((voter) => voter.tryerf.toString() === req.params.userVoted);
  ryberft.length > 0
    ? (
      wrcewrc.votes += 1,
      ytgrwedrthrt = ryberft[0].werrtverg === -1 ? 10 : 5,
      wrcewrc.voters[wrcewrc.voters.findIndex((obj) => obj.tryerf == req.params.userVoted)].werrtverg = Math.min(ryberft[0].werrtverg + 1, 1) )
    : (
      wrcewrc.votes += 1,
      ytgrwedrthrt = 5,
      wrcewrc.voters.push({
        tryerf: req.params.userVoted,
        werrtverg: 1, }));
  await wrcewrc.save();
  const userToUpdate = await Users .findOne({ _id: wrcewrc.asked_by }).exec();
  userToUpdate.reputation += ytgrwedrthrt;
  await userToUpdate.save();
  res.status(200).send(wrcewrc);});

router .patch('/comments/incrementVotes/:comment/:userVoted', async (req, res) => {
  const ytersf = await Comments .findById(req.params.comment).exec();
  let edwerfrty = 0;
  ytersf ?
    (voterObj = ytersf.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted),
      voterObj.length === 0 ?
        (ytersf.votes += 1,
          edwerfrty = 5,
          ytersf.voters.push({ userVoted: req.params.userVoted }))
        : null,
      await ytersf.save(),
      userToUpdate = await Users .findOne({ _id: ytersf.com_by }).exec(),
      userToUpdate.reputation += edwerfrty,
      await userToUpdate.save(),
      res.status(200).send(ytersf))
    : res.status(404).send('Question not found');});

router .patch('/decrementVotes/:question/:userVoted', async (req, res) => {
  const rweferftth = await Questions .findById(req.params.question).exec();
  let rwedytg = 0;
  if (!rweferftth) return res.status(404).send('Question not found');
  let wedxercttyu = rweferftth.voters.filter((voter) => voter.tryerf.toString() === req.params.userVoted);
  wedxercttyu.length > 0
    ? (
      rweferftth.votes -= 1,
      rwedytg = wedxercttyu[0].werrtverg === 1 ? 5 : 10,
      rweferftth.voters[rweferftth.voters.findIndex((obj) => obj.tryerf == req.params.userVoted)].werrtverg = Math.max(wedxercttyu[0].werrtverg - 1, -1) )
    : (
      rweferftth.votes -= 1,
      rwedytg = 10,
      rweferftth.voters.push({
        tryerf: req.params.userVoted,
        werrtverg: -1,}) );
  
  await rweferftth.save();
  const userToUpdate = await Users .findOne({ _id: rweferftth.asked_by }).exec();
  userToUpdate.reputation -= rwedytg;
  await userToUpdate.save();
  res.status(200).send(rweferftth);});

module.exports = router ;