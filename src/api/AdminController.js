import MenuModel from '@/model/Menus'
import RolesModel from '@/model/Roles'
class AdminController {
  async getMenu (ctx) {
    const result = await MenuModel.find()
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async addMenu (ctx) {
    const { body } = ctx.request
    const menu = new MenuModel(body)
    const result = await menu.save()
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async updateMenu (ctx) {
    const { body } = ctx.request
    const result = await MenuModel.updateOne({ _id: body._id }, body)
    if (result.n >= 1) {
      ctx.body = {
        code: 200,
        data: result
      }
    } else {
      ctx.body = {
        code: 200,
        msg: '删除失败'
      }
    }
  }

  async addRole (ctx) {
    const { body } = ctx.request
    const roles = new RolesModel(body)
    const result = await roles.save()
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async updateRoles (ctx) {
    const { body } = ctx.request
    const result = await RolesModel.updateOne({ _id: body._id }, body)
    if (result.n >= 1) {
      ctx.body = {
        code: 200,
        data: result
      }
    } else {
      ctx.body = {
        code: 200,
        msg: '删除失败'
      }
    }
  }

  async getRoles (ctx) {
    const result = await RolesModel.find()
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async getRoleName (ctx) {
    const result = await RolesModel.find({}, { menu: 0, desc: 0 })
    ctx.body = {
      code: 200,
      data: result
    }
  }
}
export default new AdminController()
