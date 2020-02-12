
'use strict';

const Controller = require('egg').Controller;

class LikeController extends Controller {
  // 点赞
  async like() {
    const { ctx, service } = this;
    const { post_id, state } = ctx.query;
    if (!post_id) {
      ctx.helper.fail({ m: '参数错误' });
      return
    }
    let transaction;
    let data = { post_id, user_id: ctx.state.user_id }
    try {
      transaction = await this.ctx.model.transaction();
      if (state==true) {
        await Promise.all([service.like.like(data, transaction), service.like.userLike(data, transaction)])
      } else {
        await Promise.all([service.like.unlike(data, transaction), service.like.userUnlike(data, transaction)])
      }
      await transaction.commit();
      ctx.helper.success({ m: (state ? '点赞':'取消点赞') + '成功', d: true })
    } catch (error) {
      await transaction.rollback();
      ctx.helper.fail({ m: '服务端出错了，请稍后再试', d: false })
      return false
    }
  }

}
module.exports = LikeController;
