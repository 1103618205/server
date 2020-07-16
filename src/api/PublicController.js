import svgCaptcha from 'svg-captcha'
import { setValue } from '@/config/RedisConfig'
import config from '@/config'
import { dirExists } from '@/common/Utils'
import moment from 'dayjs'
import fs from 'fs'
import uuid from 'uuid/v4'
class PublicController {
  async getCaptcha (ctx) {
    console.log('11111')
    const body = ctx.request.query

    const newCaptca = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 38
    })
    // 保存图片验证码数据，设置超时时间，单位: s
    // 设置图片验证码超时10分钟
    setValue(body.sid, newCaptca.text, 10 * 60)
    ctx.body = {
      code: 200,
      data: newCaptca.data
    }
  }

  async uploadFile (ctx) {
    const file = ctx.request.files.file
    const ext = file.name.split('.')[1]
    const filName = uuid()
    const dir = `${config.uploadPath}/${moment().format('YYYYMMDD')}/${filName}.${ext}`
    // fs.createReadStream(file.path).pipe(fs.createWriteStream(dir))
    dirExists(dir)
    const reader = fs.createReadStream(file.path)
    const Write = fs.createWriteStream(dir)
    reader.pipe(Write)
    ctx.body = {
      code: 200,
      data: `${moment().format('YYYYMMDD')}/${filName}.${ext}`
    }
  }
}

export default new PublicController()
