const Service = require('egg').Service;

class UserService extends Service {

  async getUser(data) {
    const res = await this.ctx.model.User.findOne({ where: data })
    return res
  }

  async register(data) {
    const res = await this.ctx.model.User.create(data)
    return res
  }

}

module.exports = UserService;