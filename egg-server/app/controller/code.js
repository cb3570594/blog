'use strict';

const Controller = require('egg').Controller;

class CodeController extends Controller {
  async getSvgCaptcha() {
    const { ctx, service } = this;
    const res = await service.code.captcha();
    ctx.session.code = res.text;
    ctx.helper.success({ m: '', d: res.data });
  }
}

module.exports = CodeController;