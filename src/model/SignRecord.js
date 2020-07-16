import mongose from 'mongoose'
import moment from 'dayjs'
const Schema = mongose.Schema

const SignRecordSchema = new Schema({
  uid: { type: String, ref: 'users' },
  created: { type: Date },
  favs: { type: Number },
  lastSign: { type: Date }
})
SignRecordSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})
SignRecordSchema.statics = {
  findByUid: function (id) {
    return this.findOne({ uid: id }).sort({ created: -1 })
  }
}
const SignRecordModel = mongose.model('sign_record', SignRecordSchema)
export default SignRecordModel
