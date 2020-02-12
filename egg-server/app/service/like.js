const Service = require('egg').Service;

class LikeService extends Service {

  async getPostLikes(data) {
    const res = await this.ctx.model.PostLike.findOne({ where: { post_id } });
    return res
  }

  async like(data, transaction) {
    const [user, created] = await this.ctx.model.PostLike.findOrCreate({
      where: { post_id: data.post_id },
      defaults: { post_id: data.post_id, user_like_ids: data.user_id + ',', post_like_count: 1 },
      transaction
    })
    if (!created) {
      let addId = user.user_like_ids.indexOf(data.user_id) === -1 ? `${data.user_id},` : ''
      if (addId) {
        user.user_like_ids += addId
        user.post_like_count ++
      }
      await user.save({ transaction });
    }
    return true
  }

  async userLike(data, transaction) {
    const [user, created] = await this.ctx.model.UserLike.findOrCreate({
      where: { user_id: data.user_id },
      defaults: { user_id: data.user_id, post_like_ids: data.post_id + ',', user_like_count: 1 },
      transaction
    })
    if (!created) {
      let addId = user.post_like_ids.indexOf(data.post_id) === -1 ? `${data.post_id},` : ''
      console.log(addId)
      if (addId) {
        user.post_like_ids += addId
        user.user_like_count ++
      }
      await user.save({ transaction });
    }
    return true
  }
  async unlike(data, transaction) {
    const res = await this.ctx.model.PostLike.findOne({ where: { post_id: data.post_id }, transaction })
    if (res) {
      res.user_like_ids = res.user_like_ids.replace(`${data.user_id},`, '');
      res.post_like_count > 0 && res.post_like_count--;
      await res.save({ transaction });
    }
    return true
  }
  async userUnlike(data, transaction) {
    const res = await this.ctx.model.UserLike.findOne({ where: { user_id: data.user_id }, transaction })
    if (res) {
      res.post_like_ids = res.post_like_ids.replace(`${data.post_id},`, '');
      res.user_like_count > 0 && res.user_like_count--;
      await res.save({ transaction });
    }
    return true
  }
}

module.exports = LikeService;