module.exports = (options, app) => {
  return async function auth(ctx, next) {
    const userInfo = ctx.session.userInfo
    if (userInfo) {
      let { user_email, user_id } = userInfo
      ctx.state.user_email = user_email
      ctx.state.user_id = user_id
    }
    await next()
  }
}