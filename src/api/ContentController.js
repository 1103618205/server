
import Links from '@/model/Links'
import User from '@/model/User'
import { checkCode, getJWTPayload } from '@/common/Utils'
import PostModel from './../model/Post'
class ContetnController {
  async getPostList (ctx) {
    const body = ctx.query
    const sort = body.sort ? body.sort : 'created'
    const page = body.page ? parseInt(body.page) : 0
    const limit = body.limit ? parseInt(body.limit) : 20
    const option = {}
    if (typeof body.catalog !== 'undefined' && body.catalog !== '') {
      option.catalog = body.catalog
    }
    if (typeof body.isTop !== 'undefined') {
      option.isTop = body.isTop
    }

    if (typeof body.status !== 'undefined' && body.status !== '') {
      option.status = body.status
    }
    if (typeof body.isEnd !== 'undefined') {
      option.isEnd = body.isEnd
    }
    if (typeof body.tag !== 'undefined' && body.tag !== '') {
      option.tags = { $elemMatch: { name: body.tag } }
    }
    console.log(option)
    const result = await PostModel.getList(option, sort, page, limit)
    ctx.body = {
      code: 200,
      data: result,
      msg: '查找成功'
    }
  }

  async getLinks (ctx) {
    const result = await Links.find({ type: 'links' })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async getTips (ctx) {
    const result = await Links.find({ type: 'tips' })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async updatePost (ctx) {
    const body = ctx.request.body
    const id = body._id
    delete body._id
    const result = await PostModel.updateOne({ _id: id }, body)
    if (result.ok === 1) {
      ctx.body = {
        code: 200,
        data: result,
        msg: '更新成功'
      }
    } else {
      ctx.body = {
        code: 500,
        data: result,
        msg: '更新失败'
      }
    }
  }

  async getTopWeek (ctx) {
    const result = await PostModel.getTopWeek()
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async delPost (ctx) {
    const id = ctx.query.id
    if (!id) {
      ctx.body = {
        code: 500,
        msg: '请传入id'
      }
    } else {
      const cont = await PostModel.deleteOne({ _id: id })
      console.log('12344', cont)
      if (cont.n > 1) {
        ctx.body = {
          code: 200,
          msg: '删除成功'
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '删除失败'
        }
      }
    }
  }

  async addPost (ctx) {
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    console.log(body)
    const flag = await checkCode(sid, code)
    if (flag) {
      const obj = await getJWTPayload(ctx.header.authorization)
      const user = await User.findByID({ _id: obj._id })
      if (user.favs < body.fav) {
        ctx.body = {
          code: 501,
          msg: '积分不足'
        }
      } else {
        console.log('1156', body.fav)
        // await User.updateOne({ _id: obj._id }, { $inc: { favs: -body.fav } })
      }
      const newPost = new PostModel(body)
      newPost.uid = obj._id
      const result = await newPost.save()
      ctx.body = {
        code: 200,
        msg: '成功保存文章',
        data: result
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '图片验证失败'
      }
    }
  }
}
export default new ContetnController()
