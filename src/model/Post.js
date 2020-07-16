import mongoose from '@/config/DBHelpler'
import moment from 'dayjs'

const Schema = mongoose.Schema

const PostSchema = new Schema({
  uid: { type: String, ref: 'users' },
  title: { type: String },
  content: { type: String },
  created: { type: Date },
  catalog: { type: String },
  fav: { type: String },
  isEnd: { type: String },
  reads: { type: Number },
  answer: { type: Number },
  status: { type: String },
  isTop: { type: String },
  sort: { type: String },
  tags: { type: Array }
})
PostSchema.pre('save', function (next) {
  if (!this.created) this.created = new Date()
  next()
})
PostSchema.statics = {
  findByTid: function (id) {
    console.log(id)
    return this.findOne({ _id: id })
      .populate({
        path: 'uid',
        select: 'name'
      })
  },
  /**
   * 获取文章列表数据
   * @param {Object} options
   * @param {String} sort
   * @param {Number} page
   * @param {Number} limit
   */
  getList: function (options, sort, page, limit) {
    return this.find(options)
      .sort({ [sort]: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate({
        path: 'uid',
        select: 'name isVip pic '
      })
  },
  getTopWeek: function () {
    return this.find({
      created: {
        $gte: moment().subtract(7, 'days')
      }
    }, {
      answer: 1,
      title: 1
    }).sort({
      answer: -1
    }).limit(15)
  }
}
const PostModel = mongoose.model('posts', PostSchema)

export default PostModel
