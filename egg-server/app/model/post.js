'use strict';

module.exports = app => {
  const { TEXT, STRING, UUIDV4, BOOLEAN, UUID, NOW, DATE, ENUM } = app.Sequelize;

  const Post = app.model.define('post', {
    post_id: { type: UUID, primaryKey: true },
    user_id: { type: UUID },
    title: STRING(100),
    intro: STRING(200),
    content: TEXT,
    category: UUID,
    img: STRING(200),
    type: ENUM('original', 'reprint', 'translation'),  //原创  转载  翻译
    is_enable: {
      type: BOOLEAN,
      defaultValue: true,
    },
    is_hot: {
      type: BOOLEAN,
      defaultValue: false,
    }
  });

  Post.associate = function(){
    app.model.Post.belongsTo(app.model.User, { foreignKey: 'user_id' })
    app.model.Post.belongsTo(app.model.Category, { foreignKey: 'category', targetKey:"category_id", as: "ct"})
    app.model.Post.hasOne(app.model.PostLike, { foreignKey: 'post_id' })
    app.model.Post.hasOne(app.model.PostComment, { foreignKey: 'post_id'})
  }
  return Post;
};