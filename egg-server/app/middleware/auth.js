module.exports = (options, app) => {
  return async function auth(ctx, next){
    // ctx.state._csrf = ctx._csrf;
    // console.log(ctx._csrf)
    // const cookie = ctx.cookies.get("auth", {
    //   httpOnly: true,
    //   encrypt: true,
    //   signed: true,
    // })
    // console.log(cookie)
    const userInfo = ctx.session.userInfo
    if (userInfo && userInfo.user_email && userInfo.user_id) {
      await next()
    }
    ctx.helper.fail({ m: '未登录' });
  }
}