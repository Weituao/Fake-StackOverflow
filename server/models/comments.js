let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let CommentSchema = new Schema(
    {
        text : {type: String , required: true},
        com_by :  { type: Schema.Types.ObjectId, ref: 'User', required: true},
        com_date_time : {type: Date , default: Date.now},
        votes: {type: Number , default: 0},
        voters: [{
          userVoted: { type: Schema.Types.ObjectId, ref: 'User'},
        }]

    }
);

CommentSchema
.virtual('url')
.get(function () {
  return 'posts/comment/_id/' + this._id;
});

module.exports = mongoose.model('Comment', CommentSchema);