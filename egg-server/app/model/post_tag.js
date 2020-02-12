'use strict';

module.exports = app => {
  const { UUIDV4, UUID, NOW, DATE } = app.Sequelize;

  const PostTag = app.model.define('post_tag', {
    post_tag_id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
    post_id: {
      type: UUID,
      allowNull: false
    },
    tag_id: {
      type: UUID,
      allowNull: false
    }
  })

  PostTag.associate = function () {
    app.model.PostTag.belongsTo(app.model.Tag, { foreignKey: 'tag_id' })
  }
  return PostTag
}