import { getJWTPayload } from './../common/Utils'
import SignRecord from './../model/SignRecord'
import User from './../model/User'
import moment from 'dayjs'
import send from '@/config/MailConfig'
import config from '@/config'
import jwt from 'jsonwebtoken'
import uuid from 'uuid/v4'
import bcrypt from 'bcrypt'
import { setValue, getValue } from '@/config/RedisConfig'
class UserController {
  async getall (ctx) {
    try {
      const result = await User.find()
      ctx.body = {
        code: 200,
        data: result,
        msg: '查询成功'
      }
    } catch (error) {
      console.log(error)
      ctx.body = {
        code: 500,
        msg: '查询失败'
      }
    }
  }

  async addOne (ctx) {
    const { body } = ctx.request
    const result = await User.findOne({ username: body.username })
    if (result) {
      ctx.body = {
        code: 501,
        msg: '已存在该用户'
      }
      return
    }
    body.password = await bcrypt.hash(body.password, 5)
    const user = new User(body)
    try {
      await user.save()
      ctx.body = {
        code: 200,
        msg: '添加成功'
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: error.toString()
      }
    }
  }

  async updateOne (ctx) {
    const { body } = ctx.request
    const id = body._id
    const result1 = await User.findOne({ _id: id })
    console.log('123')
    if (!result1) {
      ctx.body = {
        code: 500,
        msg: '用户不存在'
      }
    } else {
      if (result1.username !== body.username) {
        const result2 = await User.findOne({ username: body.username })
        if (result2) {
          ctx.body = {
            code: 501,
            msg: '用户名已经存在'
          }
          return
        }
      }
      delete body._id
      try {
        await User.updateOne({ _id: id }, body)
        ctx.body = {
          code: 200,
          msg: '修改成功'
        }
      } catch (error) {
        ctx.body = {
          code: 500,
          msg: '修改失败'
        }
      }
    }
  }

  async del (ctx) {
    const id = ctx.query.id
    if (!id) {
      ctx.body = {
        code: 400,
        msg: '请输入id'
      }
    } else {
      try {
        const result = await User.deleteOne({ _id: id })
        if (result.n >= 1) {
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
      } catch (error) {
        ctx.body = {
          code: 500,
          msg: '服务器内部错误:' + error.toJSON()
        }
      }
    }
  }

  async UserSign (ctx) {
    const obj = await getJWTPayload(ctx.header.authorization)
    const record = await SignRecord.findByUid(obj._id)
    const user = await User.findByID(obj._id)
    let newRecord = {}
    let result = {}
    if (record !== null) {
      const count = user.count
      let fav = 0
      if (moment(record.created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
        ctx.body = {
          code: 500,
          favs: user.favs,
          count: user.count,
          msg: '已经签到过了'
        }
        return
      } else if (moment(record.created).format('YYYY-MM-DD') === moment().subtract(1, 'days').format('YYYY-MM-DD')) {
        if (!count && count < 5) {
          fav = 5
        } else if (count >= 5 && count < 15) {
          fav = 10
        } else if (count >= 15 && count < 30) {
          fav = 15
        } else if (count >= 30 && count < 100) {
          fav = 20
        } else if (count >= 100 && count < 365) {
          fav = 30
        } else {
          fav = 50
        }
      } else {
        await User.updateOne({
          _id: obj._id
        }, {
          $set: { count: 1 },
          $inc: { favs: fav }
        })
        result = {
          favs: user.favs + fav,
          count: 1
        }
        newRecord = new SignRecord({
          uid: obj._id,
          favs: fav,
          lastSign: record.created

        })
        await newRecord.save()
      }
    } else {
      await User.updateOne({
        _id: obj._id
      }, {
        $set: { count: 1 },
        $inc: { favs: 5 }
      })
      newRecord = new SignRecord({
        uid: obj._id,
        favs: 5,
        lastSign: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      await newRecord.save()
      result = {
        favs: 5,
        count: 1
      }
    }
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: result
    }
  }

  async getInfo (ctx) {
    const obj = await getJWTPayload(ctx.query.token)
    const user = await User.findByID(obj._id)
    ctx.body = {
      code: 200,
      data: user.toJSON()
    }
  }

  async updateUserInfo (ctx) {
    const { body } = ctx.request
    const obj = await getJWTPayload(ctx.header.authorization)
    const user = await User.findOne({ _id: obj._id })
    let msg = ''
    if (body.username && body.username !== user.username) {
      const key = uuid()
      const result = await User.findOne({ username: obj.username })
      if (result && result.password) {
        ctx.body = {
          code: 501,
          msg: '邮箱已经被注册'
        }
        return
      }
      setValue(key, jwt.sign({ _id: obj._id }, config.JWT_SECRET, {
        expiresIn: '30m'
      }))
      await send({
        type: 'email',
        data: {
          key: key,
          username: body.username
        },
        expire: moment()
          .add(30, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
        email: '1103618205@qq.com',
        user: user.name
      })
      msg = '请查收邮件'
    }
    const arr = ['username', 'mobile', 'password']
    arr.map((item) => {
      delete body[item]
    })
    const result = await User.updateOne({ _id: obj._id }, body)
    if (result.n === 1 && result.ok === 1) {
      ctx.body = {
        code: 200,
        msg: msg === '' ? '操作成功' : msg
      }
    } else {
      ctx.body = {
        code: 500,
        msg: msg === '' ? '操作失败' : msg
      }
    }
  }

  async updateUsername (ctx) {
    const body = ctx.request
    if (body.key) {
      const token = await getValue(body.key)
      const obj = getJWTPayload('Bearer ' + token)
      await User.updateOne({ _id: obj._id }, {
        username: body.username
      })
    }
  }
}
export default new UserController()
