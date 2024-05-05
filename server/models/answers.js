let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let AnswerSchema = new Schema(
    {
        text : {type: String , required: true},
        ans_by :  { type: Schema.Types.ObjectId, ref: 'User', required: true},
        ans_date_time : {type: Date , default: Date.now},
        votes: {type: Number , default: 0},
        comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
        voters: [{
          userVoted: { type: Schema.Types.ObjectId, ref: 'User'},
          direction: { type: Number, default: 0},
        }]
    }
);

AnswerSchema
.virtual('url')
.get(function () {
  return 'posts/answer/_id/' + this._id;
});

module.exports = mongoose.model('Answer', AnswerSchema);