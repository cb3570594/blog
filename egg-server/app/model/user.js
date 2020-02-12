'use strict';

module.exports = app => {
  const { CHAR, STRING, UUIDV4, BOOLEAN, UUID, NOW, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    user_id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      unique: true
    },
    user_email: {
      type: STRING(50),
      unique: true 
    },
    user_password: {
      type: STRING(50),
    },
    user_name: {
      type: STRING(100),
    },
    user_image: {
      type: STRING(200),
    },
    user_mobile: {
      type: CHAR(11),
      unique: true
    },
    is_enable: {
      type: BOOLEAN,
      defaultValue: true,
    },
  });

  User.associate = function () {
    app.model.User.hasMany(app.model.Post, { foreignKey: 'user_id' })
  }
  return User
}
