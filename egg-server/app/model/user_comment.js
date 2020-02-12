'use strict';
// 评论
module.exports = app => {
  const { UUID, TEXT, UUIDV4 } = app.Sequelize;

  const UserComment = app.model.define('user_comment', {
    user_comment_id: {
      type: UUID,
      defaultValue: UUIDV4, 
      primaryKey: true
    },
    user_id: {
      type: UUID,
      allowNull: false
    },
    post_id: {
      type: UUID,
      allowNull: false
    },
    content: {
      type: TEXT,
    }
  })

  UserComment.associate = function () {
    app.model.UserComment.belongsTo(app.model.User, { foreignKey: 'user_id' })
  }
  return UserComment
}