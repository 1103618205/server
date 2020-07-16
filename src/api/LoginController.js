import send from '@/config/MailConfig'
import bcrypt from 'bcrypt'
import moment from 'moment'
import jsonwebtoken from 'jsonwebtoken'
import config from '@/config'
import { checkCode } from '@/common/Utils'
import User from '@/model/User'
import SignRecord from '@/model/SignRecord'

class LoginController {
  async forget (ctx) {
    const { body } = ctx.request
    try {
      // body.username -> database -> email
      const result = await send({
        code: '1234',
        expire: moment()
          .add(30, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
        email: body.username,
        user: 'Brian'
      })
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功'
      }
    } catch (e) {
      console.log(e)
    }
  }

  async login (ctx) {
    // 接收用户的数据
    // 返回token
    console.log('151156156')
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code)
    if (result) {
      // 验证用户账号密码是否正确
      let checkUserPasswd = false
      const user = await User.findOne({ username: body.username })
      const userObj = user.toJSON()
      const delmap = ['password']
      if (await bcrypt.compare(body.password, user.password)) {
        checkUserPasswd = true
      }
      // mongoDB查库
      if (checkUserPasswd) {
        delmap.map(item => {
          delete userObj[item]
        })
        const signRecord = await SignRecord.findByUid(userObj._id)
        if (signRecord !== null) {
          if (moment().format('YYYY-MM-DD') === moment(signRecord.created).format('YYYY-MM-DD')) {
            userObj.isSign = true
          } else {
            userObj.isSign = false
          }
        } else {
          userObj.isSign = false
        }
        // 验证通过，返回Token数据
        const token = jsonwebtoken.sign({ _id: userObj._id }, config.JWT_SECRET, {
          expiresIn: '1d'
        })
        ctx.body = {
          code: 200,
          token: token,
          data: userObj
        }
      } else {
        // 用户名 密码验证失败，返回提示
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误'
        }
      }
    } else {
      // 图片验证码校验失败
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确,请检查！'
      }
    }
  }

  async reg (ctx) {
    // 接收客户端的数据
    const { body } = ctx.request
    // 校验验证码的内容（时效性、有效性）
    const sid = body.sid
    const code = body.code
    const msg = {}
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code)
    let check = true
    if (result) {
      // 查库，看username是否被注册
      const user1 = await User.findOne({ username: body.username })
      if (user1 !== null && typeof user1.username !== 'undefined') {
        msg.username = ['此邮箱已经注册，可以通过邮箱找回密码']
        check = false
      }
      const user2 = await User.findOne({ name: body.name })
      // 查库，看name是否被注册
      if (user2 !== null && typeof user2.name !== 'undefined') {
        msg.name = ['此昵称已经被注册，请修改']
        check = false
      }
      // 写入数据到数据库
      if (check) {
        body.password = await bcrypt.hash(body.password, 5)
        const user = new User({
          username: body.username,
          name: body.name,
          password: body.password,
          created: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        const result = await user.save()
        ctx.body = {
          code: 200,
          data: result,
          msg: '注册成功'
        }
        return
      }
    } else {
      // veevalidate 显示的错误
      msg.code = ['验证码已经失效，请重新获取！']
    }
    ctx.body = {
      code: 500,
      msg: msg
    }
  }
}

export default new LoginController()
