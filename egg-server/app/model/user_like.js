'use strict';
// 点赞
module.exports = app => {
  const { UUID, INTEGER, TEXT } = app.Sequelize;

  const UserLike = app.model.define('user_like', {
    user_id: {
      type: UUID,
      primaryKey: true
    },
    post_like_ids: {
      type: TEXT,
    },
    user_like_count: {
      type: INTEGER,
    },
  })

  return UserLike
}