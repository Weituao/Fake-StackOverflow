let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let TagSchema = new Schema(
    {
        name : {type: String , unique: true, required: true},
        created_By : { type: Schema.Types.ObjectId, ref: 'User', required: true}
    }
);

TagSchema
.virtual('url')
.get(function () {
  return 'posts/tag/_id/' + this._id;
});

module.exports = mongoose.model('Tag', TagSchema);