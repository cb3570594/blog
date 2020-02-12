
'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class CommentController extends Controller {
  // 评论
  async getComment() {
    const { ctx, service } = this;
    const data = ctx.query
    if (!data.post_id && !data.user_id) {
      ctx.helper.fail({ m: '参数错误' });
      return
    }
    const res = await service.comment.getComment(data)
    res.forEach(item => {
      item.dataValues.createdAt = moment(item.dataValues.createdAt).format('YYYY-MM-DD HH:mm:ss');
    })
    ctx.helper.success({ m: '成功', d: res })
  }

  async addComment() {
    const { ctx, service } = this;
    const { post_id, content } = ctx.request.body;
    if (!post_id || !content) {
      ctx.helper.fail({ m: '参数错误' });
      return
    }
    let transaction;
    let data = { post_id, user_id: ctx.state.user_id, content };
    try {
      transaction = await this.ctx.model.transaction();
      const res = await service.comment.addUserComment(data, transaction);
      data.user_comment_id = res.dataValues.user_comment_id;
      await service.comment.addPostComment(data, transaction);
      await transaction.commit();
      res.dataValues.createdAt = moment(res.dataValues.createdAt).format('YYYY-MM-DD HH:mm:ss');
      ctx.helper.success({ m: '评论成功', d: res })
    } catch (error) {
      if (transaction) await transaction.rollback();
      ctx.helper.fail({ m: '服务端出错了，请稍后再试', d: false })
    }
  }

  async delComment() {
    
  }

}
module.exports = CommentController;
