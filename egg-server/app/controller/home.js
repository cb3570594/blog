'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(ctx.request.path, ctx.request.ip)
      ctx.body = {
        s: true,
        d: ctx.ip
      }
  }
}

module.exports = HomeController;
