'use strict';
// 评论
module.exports = app => {
  const { UUID, INTEGER, TEXT } = app.Sequelize;

  const PostComment = app.model.define('post_comment', {
    post_id: {
      type: UUID,
      primaryKey: true
    },
    user_comment_ids: {
      type: TEXT,
    },
    post_comment_count: {
      type: INTEGER,
    }
  })

  return PostComment
}