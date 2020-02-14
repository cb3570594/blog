const Service = require('egg').Service;

class PostService extends Service {

  async list(page) {
    const res = await this.ctx.model.Post.findAll({
      include: [{
        model: this.ctx.model.PostLike,
        attributes: ['post_like_count', 'user_like_ids']
      }, {
        model: this.ctx.model.PostComment,
        attributes: ['post_comment_count']
      }], offset: 20 * page, limit: 20, order: [['updated_at', 'DESC']]
    })
    return res;
  }

  async detail(post_id) {
    const res = await this.ctx.model.Post.findOne({
      where: { post_id },
      include: [
        {
          model: this.ctx.model.PostLike,
          attributes: ['post_like_count', 'user_like_ids']
        }, {
          model: this.ctx.model.PostComment,
          attributes: ['post_comment_count']
        }, {
          model: this.ctx.model.User
        }, {
          model: this.ctx.model.Category,
          as: 'ct',
          attributes: ['category_name']
        }
      ]
    });
    return res;
  }

  async edit(data, transaction) {
    const res = await this.ctx.model.Post.create(data, transaction);
    return res;
  }
  async update(data, transaction) {
    delete data.tag;
    const res = await this.ctx.model.Post.update(data, { where: { post_id: data.post_id }, transaction});
    return res;
  }
  // 分类
  async addCategory(category_name) {
    if (category_name) {
      let res = await this.ctx.model.Category.findOne({ where: { category_name } });
      if (!res) {
        res = await this.ctx.model.Category.create({ category_name });
        return res;
      }
    }
    return null;
  }

  async getCategory() {
    const res = await this.ctx.model.Category.findAll();
    return res;
  }

  // 标签
  async addTag(tag_name) {
    if (tag_name.length > 0) {
      const res = await this.ctx.model.Tag.bulkCreate(tag_name);
      return res;
    }
    return null;
  }
  async getTag() {
    const res = await this.ctx.model.Tag.findAll();
    return res;
  }

  async setPostTag(data, transaction) {
    const res = await this.ctx.model.PostTag.bulkCreate(data, { transaction });
    return res;
  }

  async getPostTag(data) {
    const res = await this.ctx.model.PostTag.findAll({
      where: data,
      include: [{
        attributes: ['tag_id', 'tag_name'],
        model: this.ctx.model.Tag
      }]
    });
    return res;
  }

  async delPostTag(post_id, transaction) {
    const res = await this.ctx.model.PostTag.destroy({
      where: { post_id },
      transaction
    });
    return res;
  }
}

module.exports = PostService;