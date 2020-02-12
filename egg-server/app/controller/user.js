'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto');

class UserController extends Controller {
  async login() {
    const { ctx, app, service } = this;
    let { user_email, user_password } = ctx.request.body;

    if (!user_email || !user_password) {
      ctx.helper.fail({ m: '参数错误' });
      return;
    }

    const res = await service.user.getUser({ user_email });
    if (res) {
      user_password = crypto.createHash('md5').update(user_password).digest('hex');
      if (res.dataValues.user_password !== user_password) {
        ctx.helper.fail({ m: '账号或密码不正确' });
        return
      }
      const { user_id, user_name, user_mobile, user_image } = res.dataValues
      // const token = app.jwt.sign({
      //   user_id,
      //   user_email
      // }, app.config.jwt.secret);
      // ctx.cookies.set("auth", token, {
      //   maxAge: 1000 * 3600 * 24 * 7
      // })
      
      ctx.session.userInfo = {
        user_email,
        user_id
      }
      ctx.helper.success({ m: '登录成功', d: { user_email, user_name, user_mobile, user_image } })
    } else {
      ctx.helper.fail({ m: '用户不存在' });
    }
  }

  async sendEmailCode() {
    const { ctx, service } = this;
    let { user_email, svgCaptchaCode } = ctx.request.body;
    if (!svgCaptchaCode) {
      ctx.helper.fail({ m: '请输入图像验证码' });
      return;
    }
    if (ctx.session.code.toUpperCase() !== svgCaptchaCode.toUpperCase()) {
      ctx.helper.fail({ m: '图像验证码错误' });
      return;
    }
    ctx.session.code = null;
    const code = ((Math.random()) * 10000).toString(16).substring(5).toUpperCase().padStart(10, 'F');
    await service.code.setEmailCode({
      user_email,
      code,
      expire_time: Date.now() + (1800 * 1000),
    }); 
    await service.code.sendEmail(user_email, code);
    ctx.helper.success({ m: '发送成功，请注意查收', d: true });
  }
  async register() {
    const { ctx, service } = this;
    let { user_email, user_password, user_mobile, emailCode, svgCaptchaCode } = ctx.request.body;

    if (!user_email || !user_password || !user_mobile || !emailCode || !svgCaptchaCode) {
      ctx.helper.fail({ m: '参数错误' });
      return;
    }

    if (ctx.session.code.toUpperCase() !== svgCaptchaCode.toUpperCase()) {
      ctx.helper.fail({ m: '图像验证码错误' });
      return;
    }
    let res = await service.code.getCode({ user_email })
    if (!res || res.code !== emailCode) {
      ctx.helper.fail({ m: '邮箱验证码错误' });
      return;
    }
    res = await service.user.getUser({ user_email })
    if (res) {
      ctx.helper.fail({ m: '用户已经存在' });
      return;
    }
    res = await service.user.getUser({ user_mobile })
    if (res) {
      ctx.helper.fail({ m: '手机号被已经注册' });
      return;
    }
    user_password = crypto.createHash('md5').update(user_password).digest('hex');
    res = await service.user.register({ user_email, user_password, user_mobile })
    if (res) {
      // const token = app.jwt.sign({
      //   user_id: res.dataValues.user_id,
      //   user_email
      // }, app.config.jwt.secret);
      // ctx.cookies.set("auth", token, {
      //   maxAge: 1000 * 3600 * 24 * 7,
      // })
      let { user_name, user_image } = res._previousDataValues
      ctx.session.userInfo = {
        user_email,
        user_id: res.dataValues.user_id
      }
      ctx.helper.success({ m: '注册成功', d: { user_email, user_name, user_mobile, user_image } })
    }
  }

  async getUserInfo() {
    const { ctx, service } = this;
    let { user_email } = ctx.state;
    if (!user_email) {
      ctx.helper.fail({ m: '参数错误' });
      return;
    }
    const user = await service.user.getUser({ user_email });
    if (!user) {
      ctx.helper.fail({ m: '用户不存在' });
      return;
    }
    ctx.helper.success({ m: '', d: user });
  }
  async logout() {
    const { ctx } = this;
    // ctx.cookies.set("auth", '')
    ctx.session = null;
    ctx.helper.success({ m: '登出成功', d: true });
  }
}

module.exports = UserController;
