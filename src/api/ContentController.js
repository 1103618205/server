import Post from './../model/Post'
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

    if (typeof body.status !== 'undefined') {
      option.status = body.status
    }
    if (typeof body.isEnd !== 'undefined') {
      option.isEnd = body.isEnd
    }
    if (typeof body.tag !== 'undefined' && body.tag !== '') {
      option.tags = { $elemMatch: { name: body.tag } }
    }
    console.log(option)
    const result = await Post.getList(option, sort, page, limit)
    ctx.body = {
      code: 200,
      data: result,
      msg: '查找成功'
    }
  }
}
export default new ContetnController()
