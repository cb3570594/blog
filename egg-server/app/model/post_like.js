'use strict';
// 点赞
module.exports = app => {
  const { UUID, INTEGER, TEXT } = app.Sequelize;

  const PostLike = app.model.define('post_like', {
    post_id: {
      type: UUID,
      primaryKey: true
    },
    user_like_ids: {
      type: TEXT,
    },
    post_like_count: {
      type: INTEGER,
    },
  })

  // PostLike.associate = function () {
  //   app.model.PostLike.belongsTo(app.model.Post, {
  //     foreignKey: 'post_id', sourceKey: 'post_id', targetKey: 'post_id' })
  // }
  return PostLike
}