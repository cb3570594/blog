'use strict';

// const JWT = Symbol('Application#jwt');

module.exports = {
  async auth(ctx, next) {
    const userInfo = ctx.session.userInfo
    if (userInfo && userInfo.user_email && userInfo.user_id) {
      await next()
    } else {
      ctx.helper.fail({ m: '未登录' });
    }
  },
};