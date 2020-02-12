const Service = require('egg').Service;

class CommentService extends Service {
  async getComment(data) {
    const res = await this.ctx.model.UserComment.findAll({
      where: data,
      include: [{
        model: this.ctx.model.User,
        attributes: ['user_email', 'user_name', 'user_image']
      }], order: [['updated_at', 'DESC']]
    })
    return res
  }

  async addPostComment(data, transaction) {
    return this.ctx.model.PostComment.findOrCreate({
      where: { post_id: data.post_id },
      defaults: { post_id: data.post_id, user_comment_ids: data.user_comment_id + ',', post_comment_count: 1 },
      transaction
    }).then(([comment, created]) => {
      if (!created) {
        let addId = comment.user_comment_ids.indexOf(data.user_comment_id) === -1 ? `${data.user_comment_id},` : ''
        comment.user_comment_ids += addId
        comment.post_comment_count++
        comment.save({ transaction})
      }
    })
  }

  async addUserComment(data, transaction) {
    const res = await this.ctx.model.UserComment.create({
      user_id: data.user_id,
      post_id: data.post_id,
      content: data.content,
    }, { transaction })
    return res
  }

  async delPostComment(data, transaction) {
    const res = await this.ctx.model.PostComment.findOne({
      where: {
        post_id: data.post_id
      },
      transaction
    })
    if (res) {
      res.user_comment_ids = res.user_comment_ids.replace(`${data.user_comment_id},`,"")
      res.post_comment_count > 0 && res.post_comment_count--
      await res.save({ transaction })
      return true
    } else {
      return false
    }
  }

  async delUserComment(data, transaction) {
    const res = await this.ctx.model.UserComment.destroy({
      where: {
        user_comment_id: data.user_comment_id
      },
      transaction
    })
    return res
  }
}

module.exports = CommentService;
