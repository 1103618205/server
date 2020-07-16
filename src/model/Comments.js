import mongoose from '../config/DBHelpler'
import moment from 'dayjs'
const Schema = mongoose.Schema
const CommentsSchema = new Schema({
  tid: { type: String, ref: 'posts' },
  cuid: { type: String, ref: 'users' },
  content: { type: String },
  created: { type: Date },
  hands: { type: Number, default: 0 },
  status: { type: String, default: '1' },
  isRead: { type: String, default: '0' },
  isBeat: { type: String, default: '0' }
})
CommentsSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})
CommentsSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key eror'))
  } else {
    next(error)
  }
})
CommentsSchema.statics = {
  getCommentsList: function (id, page, limit) {
    return this.find({ tid: id })
      .populate({
        path: 'tid',
        select: 'title'
      })
      .populate({
        path: 'cuid'
      }).skip(page * limit).limit(limit)
  }
}
const comments = mongoose.model('comments', CommentsSchema)
export default comments
