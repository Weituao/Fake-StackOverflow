// Routing to /posts/questions
const jigef = require('express');
const ujhed = jigef.Router();
const jhedf = require('../models/questions');
const yeifg = require('../models/tags');
const jhedwtyg = require('../models/answers');
const herf = require('../models/users');
const irtgd = require('../models/comments');
const jgeggh = require('../middleware/auth');

async function gergthg(searchWords) {
  let rghyrfe = [];
  let i = 0;
  while (i < searchWords.length) {
    const fgdfder = searchWords[i].replace(/[\\.+*?^$[\](){}/'#:!=|]/gi, '\\$&'); // escape special characters
    const ijrddhe = jhedf.find({
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
      tagObj = await yeifg.findOne({ name: { $regex: tag, $options: 'i' } }); } catch (err) {
      console.error(err); }
    return tagObj ? tagObj._id : null;}));
  let tyhfdwed;
  try {
    tyhfdwed = await jhedf.find({ tags: { $in: tagIds } }).sort({ ask_date_time: -1 }); } catch (err) {
    console.error(err);
    tyhfdwed = [];}
  return tyhfdwed;}
ujhed.get('/', (req, res) => {
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

ujhed.get('/search/:searchText', async (req, res) => {
  const efut = req.params.searchText;
  const hjgedth = efut.trim() === '' ? 
                  await jhedf.find().sort({ ask_date_time: -1 }).exec() :
                  await ijtertut(efut);
  const uwfgh = [];
  let i = 0;
  while (i < hjgedth.length) {
    const wegrd = hjgedth[i];
    (uwfgh.filter(r => r.id === wegrd.id).length ? null : uwfgh.push(wegrd));
    i++; }
  res.send(uwfgh);});

ujhed.get('/newest', (req, res) => {
  jhedf.find().sort({ ask_date_time: -1 }).exec()
    .then(thgre => res.send(thgre))
    .catch(err => (console.error(err), res.status(500).send('Internal Server Error')));});

ujhed.get('/newest/:searchTest', async (req, res) => {
  const ik7erftg = req.params.searchTest;
  const asdrtgv = ik7erftg.trim() === '' ? 
    await jhedf.find().sort({ ask_date_time: -1 }).exec() :
    await ijtertut(ik7erftg).catch(err => (console.error(err), res.status(500).send('Internal Server Error')));
  res.send(asdrtgv);});

async function htrh(answerIds) {
  let dyodfs = new Date(0);
  let i = 0;
  while (i < answerIds.length) {
    const erws = answerIds[i];
    const etrferct = (await jhedwtyg.findById(erws)) || {};
    etrferct.ans_date_time > dyodfs ? dyodfs = etrferct.ans_date_time : null;
    i++; }
  return dyodfs;}

ujhed.get('/active', async (req, res) => {
  const jyhtgrfewrgr = await jhedf.find({ answers: { $size: 0 } }).sort({
    ask_date_time: -1, });
  let dmqh = new Map();
  let rhjiee = [];
  let hiurfdse = await jhedf.find({ answers: { $exists: true, $ne: [] } });
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

ujhed.get('/active/:searchText', async (req, res) => {
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

ujhed.get('/unanswered', (req, res) => {
  jhedf.find({ answers: { $size: 0 } })
    .sort({ ask_date_time: -1 })
    .exec()
    .then(ergerfg => {
      res.send(ergerfg); })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');});});

ujhed.get('/unanswered/:searchText', (req, res) => {
  const hgefreg = req.params.searchText;
  (hgefreg.trim() === '') ?
    (res.redirect('/unanswered'), null) :
    ijtertut(hgefreg)
      .then(uniqueResults => res.send(uniqueResults.filter(result => result.answers.length === 0)))
      .catch(err => (console.error(err), res.status(500).send('Internal Server Error')));});


ujhed.get('/comments/:question_id', async (req, res) => {
  const th65hrdfg = req.params.question_id;
  return !th65hrdfg
    ? res.status(400).send('Invalid question ID')
    : jhedf.findById(th65hrdfg)
        .exec()
        .then(rteef =>
          !rteef
            ? res.status(404).send('Question not found')
            : irtgd.find({ _id: { $in: rteef.comments } }).sort({ com_date_time: -1 }) )
        .then(rgre =>
          !rgre || rgre.length === 0
            ? res.status(404).send('Comments not found')
            : res.send(rgre) )
        .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error'); });});

ujhed.get('/:question', async (req, res) => {
  const rttergrgh = req.params.question;
  const ukytgrf = !rttergrgh ? null : await jhedf.findById(rttergrgh).exec();

  !ukytgrf
    ? res.status(400).send('Invalid question ID')
    : (ukytgrf !== null && ukytgrf !== undefined ? res.send(ukytgrf) : res.status(404).send('Question not found'));});

ujhed.get('/byUser/:userId', (req, res) => {
  jhedf.find({ asked_by: req.params.userId })
    .sort({ ask_date_time: -1 })
    .exec()
    .then(ccuyh => res.send(ccuyh))
    .catch(err => (console.error(err), res.status(500).send('Internal Server Error')));});

ujhed.patch('/incrementViews/:question', async (req, res) => {
  const tufetr = req.params.question;
  const dwreytbu = !tufetr ? null : await jhedf.findById(tufetr).exec();
  !dwreytbu 
    ? res.status(400).send('Invalid question ID')
    : (dwreytbu !== null && dwreytbu !== undefined 
        ? (dwreytbu.views += 1, dwreytbu.save(), res.send(dwreytbu))
        : res.status(404).send('Question not found'));});

ujhed.use(jgeggh);

ujhed.post('/askQuestion', async (req, res) => {
  const tujgserc = req.body;
  const wsetg = req.session.user.userId; 
  const urdt = Array.isArray(tujgserc.tagNames) ? tujgserc.tagNames : [];
  const wydfry = [...new Set(urdt)];
  const thergth = await Promise.all(wydfry.map(async (tag) => {
    const yjterre = await yeifg.findOne({ name: tag }).exec();
    const rrcegtyh = await herf.findOne({ _id: wsetg }).exec();
    return yjterre ? yjterre._id : (rrcegtyh.reputation < 50 ? res.send({ error: true, message: 'User must have at least 50 reputation points to create a new tag.' }) && null : (await (new yeifg({ name: tag, created_By: wsetg })).save())._id); }));

  if (thergth.includes(null)) return;

  const wrtuijfes = new jhedf({
    title: tujgserc.title,
    summary: tujgserc.summary,
    text: tujgserc.text,
    tags: thergth,
    asked_by: wsetg,});

  wrtuijfes.save()
    .then((savedQuestion) => {
      res.send(savedQuestion); })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error creating question'); });});


ujhed.put('/editQuestion/:question', async (req, res) => {
  const tfwerthb = await jhedf.findById(req.params.question).exec();
  const trwedrth = req.body;
  const ytetrf = Array.isArray(trwedrth.tagNames) ? trwedrth.tagNames : [];
  const ertvyt = [...new Set(ytetrf)];
  const ghreg = await Promise.all(ertvyt.map(async (tag) => {
    const retgrtg = await yeifg.findOne({ name: tag }).exec();
    if (!retgrtg && herf.reputation < 50) {
      res.send({ error: true, message: 'User must have at least 50 reputation points to create a new tag.' });
      return null; }
    const greg = !retgrtg ? new yeifg({ name: tag, created_By: tfwerthb.asked_by }) : null;
    const ette = greg ? await greg.save() : null;
    return retgrtg ? retgrtg._id : ette._id; }));
  if (ghreg.includes(null)) return;
  tfwerthb.title = trwedrth.title;
  tfwerthb.summary = trwedrth.summary;
  tfwerthb.text = trwedrth.text;
  tfwerthb.tags = ghreg.filter(tagId => tagId !== null);
  await tfwerthb.save();
  res.send(tfwerthb);});


ujhed.delete('/deleteQuestion/:question', async (req, res) => {
  const rfwertgy = await jhedf.findById(req.params.question).exec();
  !rfwertgy
    ? res.status(404).send('Question not found')
    : (await Promise.all(rfwertgy.answers.map(answer => jhedwtyg.findByIdAndDelete(answer).exec())),
       await Promise.all(rfwertgy.comments.map(comment => irtgd.findByIdAndDelete(comment).exec())),
       await jhedf.findByIdAndDelete(req.params.question).exec(),
       res.send('success'));
});

ujhed.patch('/incrementVotes/:question/:userVoted', async (req, res) => {
  const wrcewrc = await jhedf.findById(req.params.question).exec();
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
  const userToUpdate = await herf.findOne({ _id: wrcewrc.asked_by }).exec();
  userToUpdate.reputation += ytgrwedrthrt;
  await userToUpdate.save();
  res.status(200).send(wrcewrc);});

ujhed.patch('/comments/incrementVotes/:comment/:userVoted', async (req, res) => {
  const ytersf = await irtgd.findById(req.params.comment).exec();
  let edwerfrty = 0;
  ytersf ?
    (voterObj = ytersf.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted),
      voterObj.length === 0 ?
        (ytersf.votes += 1,
          edwerfrty = 5,
          ytersf.voters.push({ userVoted: req.params.userVoted }))
        : null,
      await ytersf.save(),
      userToUpdate = await herf.findOne({ _id: ytersf.com_by }).exec(),
      userToUpdate.reputation += edwerfrty,
      await userToUpdate.save(),
      res.status(200).send(ytersf))
    : res.status(404).send('Question not found');});

ujhed.patch('/decrementVotes/:question/:userVoted', async (req, res) => {
  const rweferftth = await jhedf.findById(req.params.question).exec();
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
  const userToUpdate = await herf.findOne({ _id: rweferftth.asked_by }).exec();
  userToUpdate.reputation -= rwedytg;
  await userToUpdate.save();
  res.status(200).send(rweferftth);
});

module.exports = ujhed;