'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(ctx.request.path)
      ctx.body = {
        s: true,
        d: ''
      }
  }
}

module.exports = HomeController;
