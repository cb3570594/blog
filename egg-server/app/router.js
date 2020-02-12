'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, auth } = app;
  router.get('/api/', controller.home.index);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/logout', controller.user.logout);
  router.post('/api/user/register', controller.user.register);
  router.get('/api/user/getUserInfo', auth, controller.user.getUserInfo);
  // 统计访问
  router.post('/api/visit', controller.visit.setVisit)
  // 发送验证码
  router.get('/api/getSvgCaptcha', controller.code.getSvgCaptcha);
  router.post('/api/sendEmailCode', controller.user.sendEmailCode);
  // 文章类
  router.get('/api/post/list', controller.post.list);
  router.post('/api/post/edit', auth, controller.post.edit);
  router.post('/api/post/addCategory', auth, controller.post.addCategory);
  router.get('/api/post/getCategory', controller.post.getCategory);
  router.post('/api/post/addTag', auth, controller.post.addTag);
  router.get('/api/post/getTag', controller.post.getTag);
  router.get('/api/post/:id', controller.post.detail);
  // 文章类操作
  router.put('/api/post/like', auth, controller.like.like);
  router.post('/api/comment/add', auth, controller.comment.addComment);
  router.post('/api/comment/del', auth, controller.comment.delComment);
  router.get('/api/comment/get', auth, controller.comment.getComment);
  // 上传图片
  router.post("/api/upload", auth, controller.upload.upload)
};
