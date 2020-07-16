import PostModel from '@/model/Post'
import comments from '@/model/Comments'
import User from '@/model/User'
import { getJWTPayload } from '@/common/Utils'
class CommentsControlller {
  async tgetDetail (ctx) {
    const { body } = ctx.request
    const tid = body.tid

    if (!tid) {
      ctx.body = {
        code: 500,
        msg: '请传入文章id'
      }
    }

    const post = await PostModel.findByTid(tid)
    ctx.body = {
      code: 200,
      data: post,
      msg: '查询成功'
    }
  }

  async getComments (ctx) {
    const params = ctx.query
    console.log(params)
    const tid = params.tid
    const page = params.page
    const limit = 10
    const result = await comments.getCommentsList(tid, page, limit)
    // const total = await comments.queryCount(tid)
    ctx.body = {
      code: 200,

      data: result,
      msg: '查询成功'
    }
  }

  async addComments (ctx) {
    const { body } = ctx.request
    const content = body.content
    const tid = body.tid

    const obj = getJWTPayload(ctx.header.authorization)
    const data = {
      content,
      tid,
      uid: obj._id
    }
    // eslint-disable-next-line new-cap
    const newcomments = new comments(data)
    const result = await newcomments.save(data)
    ctx.body = {
      code: 200,
      data: result,
      msg: '上传成功'
    }
  }

  async updateContent (ctx) {
    const { body } = ctx.request
    const id = body.tid
    delete body.tid
    if (id) {
      console.log(body)
      const result = await comments.updateOne({ _id: id }, {
        $set: body
      })
      if (body.fav) {
        await PostModel.updateOne({ _id: body.pid }, {
          $set: {
            isEnd: '1'
          }
        })
        await User.updateOne({ _id: body.uid }, {
          $inc: { fav: parseInt(body.fav) }
        })
      }

      ctx.body = {
        code: 200,
        data: result,
        msg: '修改完成'
      }
    } else {
      // eslint-disable-next-line new-cap
      const datas = new comments(body)
      const result = await comments.save(datas)
      ctx.body = {
        code: 200,
        data: result,
        msg: '修改完成'
      }
    }
  }
}
export default new CommentsControlller()
