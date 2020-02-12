'use strict';

module.exports = app => {
  const { STRING, DATE } = app.Sequelize;

  const Code = app.model.define('code', {
    user_email: {
      type: STRING(50),
      primaryKey: true,
      unique: true
    },
    code: {
      type: STRING(10),
    },
    expire_time: {
      type: DATE,
    },
  });

  return Code
}
