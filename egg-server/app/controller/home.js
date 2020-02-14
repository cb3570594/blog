'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const ip = ctx.ip.split(':')[0];
    if (ip) {
      const res = await ctx.curl(`http://ip.taobao.com/service/getIpInfo.php?ip=${ip}`, { dataType: 'json', gzip: true });
      ctx.helper.success({ d: res.data });
    } else {
      ctx.helper.fail({ d: `ctx.ip: ${ctx.ip}, 不存在` });
    }
  }
}

module.exports = HomeController;
