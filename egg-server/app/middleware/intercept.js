module.exports = (options, app) => {
  return async function auth(ctx, next) {
    try {
      await next()
    } catch (error) {
      ctx.helper.fail({ m: '服务端报错了' });
    }
  }
}