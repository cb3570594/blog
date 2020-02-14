
'use strict';

const Controller = require('egg').Controller;
const uuidv4 = require('uuid/v4');
const moment = require('moment');
moment.locale('zh-cn');
// console.log(moment().format('YYYYMMDDHHmmss'))
const fs = require('fs-extra');
const path = require('path');

class PostController extends Controller {
  async list() {
    const { ctx, service } = this;
    const { page } = ctx.query;
    const res = await service.post.list(page);
    res.forEach(({ dataValues }) => {
      dataValues.updated_at = moment(dataValues.updated_at || dataValues.updatedAt).fromNow();
      dataValues.isLike = dataValues.post_like && dataValues.post_like.user_like_ids.indexOf(ctx.state.user_id) !== -1 || false;
      dataValues.likeCount = dataValues.post_like && dataValues.post_like.post_like_count || 0;
      dataValues.commentCount = dataValues.post_comment && dataValues.post_comment.post_comment_count || 0;
      delete dataValues.post_like;
      delete dataValues.post_comment;
    })
    ctx.helper.success({ s: true, d: res })
  }

  async detail() {
    const { ctx, service } = this;
    const post_id = ctx.params.id;
    if(!post_id){
      ctx.helper.fail({ m: '参数错误' });
      return;
    }
    const res = await service.post.detail(post_id);
    const res2 = await service.post.getPostTag({ post_id });
    if (res) {
      let dataValues = res.dataValues;
      dataValues.created_at = moment(dataValues.created_at || dataValues.createdAt).format('YYYY-MM-DD HH:mm:ss');
      dataValues.updated_at = moment(dataValues.updated_at || dataValues.updatedAt).format('YYYY-MM-DD HH:mm:ss');
      dataValues.tagList = res2.map(item => item.dataValues.tag);
      dataValues.isLike = dataValues.post_like && dataValues.post_like.user_like_ids.indexOf(ctx.state.user_id) !== -1 || false;
      dataValues.likeCount = dataValues.post_like && dataValues.post_like.post_like_count || 0;
      dataValues.commentCount = dataValues.post_comment && dataValues.post_comment.post_comment_count || 0;
      delete dataValues.post_like;
      delete dataValues.post_comment;
      ctx.helper.success({ s: true, d: res });
    }else{
      ctx.helper.fail({ m: '文章不存在' });
    }
  }

  async edit() {
    const { ctx, service, config } = this;
    const createRule = {
      title: { type: 'string' },
      intro: { type: 'string' },
      content: { type: 'string' },
      tag: { type: 'array' },
      category: { type: 'string' },
      type: { type: 'string' }
    };
    try {
      ctx.validate(createRule);
    } catch (err) {
      ctx.helper.fail({ m: '参数错误' });
    }
    let { post_id, user_id, tag, img } = ctx.request.body;

    // 处理临时文件
    if (img) {
      const sourceImage = path.join(config.baseDir, 'app', img);
      if (!fs.pathExistsSync(sourceImage)) {
        ctx.helper.fail({ m: '图片失效' });
        return;
      }
      img = img.replace('\\temp\\', '\\upload\\');
      const targetImage = path.join(config.baseDir, 'app', img);
      if (sourceImage !== targetImage) {
        fs.moveSync(sourceImage, targetImage);
      }
    }
    let transaction = null;
    try {
      transaction = await ctx.model.transaction();
      if (post_id) {
        // 修改
        if (ctx.state.user_id !== user_id) {
          ctx.helper.fail({ m: '没有权限' });
          return;
        }
        const postTag = tag.map(item => ({ post_id, tag_id: item }));
        await service.post.delPostTag(post_id, transaction);
        await Promise.all([service.post.update({ post_id, user_id: ctx.state.user_id, ...ctx.request.body, img }, transaction), service.post.setPostTag(postTag, transaction)]);
        await transaction.commit();
        ctx.helper.success({ m: '修改成功', d: post_id });
      } else {
        // 发布
        post_id = uuidv4()
        console.log('发布', post_id)
        const postTag = tag.map(item => ({ post_id, tag_id: item }));
        await Promise.all([service.post.edit({ post_id, user_id: ctx.state.user_id, ...ctx.request.body, img }, transaction), service.post.setPostTag(postTag, transaction)]);
        await transaction.commit();
        ctx.helper.success({ m: '发布成功', d: post_id });
      }
    } catch (error) {
      console.log(error)
      if (transaction) await transaction.rollback();
      ctx.helper.fail({ m: '服务端出错了，请稍后再试', d: false });
    }
  }

  // 分类
  async addCategory() {
    const { ctx, service } = this;
    let { category_name } = ctx.request.body;
    if (category_name) {
      const res = await service.post.addCategory(category_name);
      if (res) {
        ctx.helper.success({ m: '添加成功' });
      } else {
        ctx.helper.fail({ m: '重复的分类名称' });
      }
    } else {
      ctx.helper.fail({ m: '请输入分类名称' });
    }
  }
  async getCategory() {
    const { ctx, service } = this;
    const res = await service.post.getCategory();
    ctx.helper.success({ d: res });
  }
  // 标签
  async addTag() {
    const { ctx, service } = this;
    let { tag_name } = ctx.request.body;
    if (tag_name) {
      const currentTags = await service.post.getTag();
      const currentTagsSet = new Set(currentTags.map(item => item.tag_name));
      const needAddTags = tag_name.filter(item => !currentTagsSet.has(item)).map(item => ({ tag_name: item }));
      const res = await service.post.addTag(needAddTags);
      if (res) {
        ctx.helper.success({ m: '添加成功' });
      } else {
        ctx.helper.fail({ m: '重复的标签名称' });
      }
    } else {
      ctx.helper.fail({ m: '请输入标签名称' });
    }
  }
  async getTag() {
    const { ctx, service } = this;
    const res = await service.post.getTag();
    ctx.helper.success({ d: res.map(item => ({tag_id: item.tag_id, tag_name: item.tag_name})) });
  }

}

module.exports = PostController;
